// Pure NIP-string scanner for JS/TS documents. No vscode imports allowed here: this module is
// unit-tested directly (src/test/scanner.test.ts), including ReDoS canaries over SCANNER_REGEXES,
// which is what guards against the 1.5.0 extension-host freeze recurring.

// Interfaces for JS/TS NIP string detection
export interface NipStringMatch {
  content: string; // The NIP string content (without quotes)
  lineNumber: number; // Line number in the document
  startColumn: number; // Start column of the string content (after the quote)
  endColumn: number; // End column of the string content (before the quote)
}

// Structural subset of vscode.TextDocument the scanner needs; tests pass fakes.
export interface ScannableDocument {
  uri: { toString(): string };
  version: number;
  getText(): string;
}

// String bodies must keep the escape branch and the plain-char branch DISJOINT
// ((?:\\.|(?!\1)[^\\\r\n\u2028\u2029])*) - if the plain-char branch can also eat a backslash, the
// scan backtracks exponentially on backslash-dense lines with an unclosed quote candidate and
// freezes the extension host (kolbot's ControlBot.js has a 32-backslash regex line with a
// backtick that never finishes under the overlapping form). The class excludes exactly what `.`
// excluded, minus the backslash, so the rewrite stays match-equivalent for terminated bodies.
// INLINE_NIP_JSDOC and TRAILING_COMMENT_NIP embed this same body; tests assert their sources
// compose from FIRST_STRING_LITERAL's, so the copies cannot drift apart silently.
const FIRST_STRING_LITERAL = /(["'`])((?:\\.|(?!\1)[^\\\r\n\u2028\u2029])*)\1/;

// Every regex the scanner matches against document LINES. The canary registry derives from this
// object, so registering here IS being canaried; a guard test additionally asserts no regex
// literal exists in this file outside the object (exemptions: FIRST_STRING_LITERAL's definition
// above, which is a member, and the document-split /\r?\n/ - one linear pass, no line input).
const LINE_SCANNING_REGEXES = {
  JSDOC_TYPE_PATTERN: /@type\s*\{(NipString(?:\[\])?|Record<string,\s*NipString(?:\[\])?>)\}/,
  // Matches a line that ends with a standalone `// nip` annotation. Must never carry the g flag:
  // it is .test()ed twice per line (pattern-7 prefilter + pattern-1 arming), and a stateful
  // lastIndex would silently desync the second call.
  LINE_ENDS_WITH_NIP: /\/\/\s*nip\s*$/i,
  INLINE_NIP_JSDOC: /\/\*\*\s*nip\s*\*\/\s*(["'`])((?:\\.|(?!\1)[^\\\r\n\u2028\u2029])*)\1/i,
  TRAILING_COMMENT_NIP: /(["'`])((?:\\.|(?!\1)[^\\\r\n\u2028\u2029])*)\1\s*,?\s*\/\/\s*nip\s*$/i,
  FIRST_STRING_LITERAL,
  STRING_LITERAL: new RegExp(FIRST_STRING_LITERAL.source, "g"),
  // Line-level JSDoc strippers used for block depth tracking (both ^-anchored: single start,
  // linear). Inline `/** ... */` segments are stripped by stripInlineJsdocSegments below - ANY
  // regex formulation of that strip is super-linear on unterminated input (each `/**` start
  // re-scans the tail for a `*/` that never comes), which the ReDoS canaries flag at 192KB.
  JSDOC_CLOSE_LINE: /^\s*\*\/\s*$/,
  JSDOC_STAR_LINE: /^\s*\*.*$/,
} as const;

const {
  JSDOC_TYPE_PATTERN,
  LINE_ENDS_WITH_NIP,
  INLINE_NIP_JSDOC,
  TRAILING_COMMENT_NIP,
  STRING_LITERAL,
  JSDOC_CLOSE_LINE,
  JSDOC_STAR_LINE,
} = LINE_SCANNING_REGEXES;

export const SCANNER_REGEXES: ReadonlyArray<{ name: string; regex: RegExp }> = Object.entries(
  LINE_SCANNING_REGEXES,
).map(([name, regex]) => ({ name, regex }));

// Strips every terminated inline `/** ... */` segment (nearest `*/` wins, matching the lazy
// regex this replaces) in one left-to-right pass - see the note above JSDOC_CLOSE_LINE for why
// this must not be a regex. One deliberate delta from the old regex: a segment interrupted by
// U+2028/U+2029 is still stripped here (the old `.*?` stopped at those, leaving the segment in
// the depth count - stripping is the more correct reading).
function stripInlineJsdocSegments(line: string): string {
  if (!line.includes("/**")) return line;
  let out = "";
  let i = 0;
  for (;;) {
    const open = line.indexOf("/**", i);
    if (open < 0) break;
    const close = line.indexOf("*/", open + 3);
    if (close < 0) break; // unterminated: keep the remainder, like the lazy regex did
    out += line.slice(i, open);
    i = close + 2;
  }
  return out + line.slice(i);
}

const nipStringCache = new Map<string, { version: number; matches: NipStringMatch[] }>();

export function clearNipStringCache(key?: string): void {
  if (key === undefined) {
    nipStringCache.clear();
  } else {
    nipStringCache.delete(key);
  }
}

export function stripInlineCommentOutsideStrings(input: string): string {
  let quote: '"' | "'" | "`" | null = null;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (quote) {
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "/" && i + 1 < input.length && input[i + 1] === "/") {
      return input.slice(0, i);
    }
  }

  return input;
}

export function findNipStringsInJS(document: ScannableDocument): NipStringMatch[] {
  const key = document.uri.toString();
  const cached = nipStringCache.get(key);
  if (cached?.version === document.version) return cached.matches;
  const matches: NipStringMatch[] = [];
  const text = document.getText();
  const lines = text.split(/\r?\n/);

  let inNipBlock = false; // True when inside a @type {NipString[]} or @type {Record<string, NipString>} block
  let blockDepth = 0; // Track { } and [ ] depth for blocks
  let blockType: "array" | "object" | null = null;
  let nextLineIsNip = false; // True when previous line was // nip

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    // Pattern 1: Previous line ended with // nip — the first string on this line is the NIP string
    if (nextLineIsNip) {
      nextLineIsNip = false;
      const stringMatch = line.match(FIRST_STRING_LITERAL);
      if (stringMatch?.[2]) {
        const content = stringMatch[2];
        // Column derives from match.index so it binds to this match.
        const startColumn = (stringMatch.index ?? 0) + 1; // +1 to skip the quote
        matches.push({
          content,
          lineNumber: lineNum,
          startColumn,
          endColumn: startColumn + content.length,
        });
        continue;
      }
    }

    // Pattern 2: /** nip */ inline before string
    const inlineMatch = line.match(INLINE_NIP_JSDOC);
    if (inlineMatch?.[2]) {
      const content = inlineMatch[2];
      // The full match ends with `content` + closing quote, so the content's position is exact
      // arithmetic - indexOf(content) could bind to an earlier copy (e.g. the word "nip" inside
      // the annotation itself).
      const stringStart = (inlineMatch.index ?? 0) + inlineMatch[0].length - content.length - 1;
      matches.push({
        content,
        lineNumber: lineNum,
        startColumn: stringStart,
        endColumn: stringStart + content.length,
      });
      continue;
    }

    // Pattern 7: "string" // nip — string and annotation on the same line.
    // Must be checked BEFORE LINE_ENDS_WITH_NIP so a line like `"string" // nip`
    // captures the inline string rather than setting nextLineIsNip for the next line.
    // LINE_ENDS_WITH_NIP is a pure prefilter here (TRAILING_COMMENT_NIP shares the same tail),
    // so the string matcher only runs on annotated lines instead of every line of the document.
    const trailingMatch = LINE_ENDS_WITH_NIP.test(line) ? line.match(TRAILING_COMMENT_NIP) : null;
    if (trailingMatch?.[2] && !inNipBlock) {
      const content = trailingMatch[2];
      // Match starts at the opening quote; +1 lands on the content. indexOf(content) could bind
      // to an earlier occurrence of the same text in the code before the string.
      const stringStart = (trailingMatch.index ?? 0) + 1;
      matches.push({
        content,
        lineNumber: lineNum,
        startColumn: stringStart,
        endColumn: stringStart + content.length,
      });
      continue;
    }

    // A line ending with // nip (standalone or after other code, with no string before it)
    // marks the next line's first string as a NIP string.
    // Guard with !inNipBlock so a redundant // nip annotation inside a @type {NipString[]}
    // or Record<string, NipString> block doesn't skip block extraction and depth tracking.
    if (!inNipBlock && LINE_ENDS_WITH_NIP.test(line)) {
      nextLineIsNip = true;
      continue;
    }

    // Patterns 3, 4, 5: JSDoc @type annotations
    const typeMatch = line.match(JSDOC_TYPE_PATTERN);
    if (typeMatch) {
      const typeAnnotation = typeMatch[1];

      if (typeAnnotation === "NipString") {
        // Pattern 3: Single NipString - look for string on this line or next line
        let stringMatch = line.match(FIRST_STRING_LITERAL);
        let targetLine = lineNum;

        if (!stringMatch && lineNum + 1 < lines.length) {
          stringMatch = lines[lineNum + 1].match(FIRST_STRING_LITERAL);
          targetLine = lineNum + 1;
        }

        if (stringMatch?.[2]) {
          const content = stringMatch[2];
          // Match starts at the opening quote on the target line; +1 lands on the content.
          const stringStart = (stringMatch.index ?? 0) + 1;
          matches.push({
            content,
            lineNumber: targetLine,
            startColumn: stringStart,
            endColumn: stringStart + content.length,
          });
        }
      } else if (typeAnnotation === "NipString[]") {
        // Pattern 4: Array of NipStrings
        inNipBlock = true;
        blockType = "array";
        blockDepth = 0;
      } else if (typeAnnotation.startsWith("Record<string,")) {
        // Pattern 5: Record<string, NipString>
        inNipBlock = true;
        blockType = "object";
        blockDepth = 0;
      }
    }

    // Track block depth and extract strings when inside a NIP block
    if (inNipBlock) {
      // Strip JSDoc content before counting brackets/braces so type annotations like
      // `@type {Record<string, NipString[]>}` do not affect depth tracking.
      const lineForDepth = stripInlineJsdocSegments(line).replace(JSDOC_CLOSE_LINE, "").replace(JSDOC_STAR_LINE, "");

      // Count opening and closing brackets/braces
      for (const ch of lineForDepth) {
        if (blockType === "array" && ch === "[") blockDepth++;
        if (blockType === "array" && ch === "]") blockDepth--;
        if (blockType === "object" && ch === "{") blockDepth++;
        if (blockType === "object" && ch === "}") blockDepth--;
      }

      // Extract all strings on this line when inside the block
      if (blockDepth > 0) {
        const lineWithoutComment = stripInlineCommentOutsideStrings(line);
        STRING_LITERAL.lastIndex = 0;
        let strMatch: RegExpExecArray | null;
        while ((strMatch = STRING_LITERAL.exec(lineWithoutComment)) !== null) {
          const content = strMatch[2];
          // Skip if this looks like an object key (followed by :)
          const afterMatch = lineWithoutComment.slice(strMatch.index + strMatch[0].length).trim();
          if (blockType === "object" && afterMatch.startsWith(":")) {
            continue; // This is a key, not a value
          }
          const stringStart = strMatch.index + 1; // +1 to skip the quote
          matches.push({
            content,
            lineNumber: lineNum,
            startColumn: stringStart,
            endColumn: stringStart + content.length,
          });
        }
      }

      // Check if block has ended
      if (blockDepth <= 0 && (lineForDepth.includes("]") || lineForDepth.includes("}"))) {
        inNipBlock = false;
        blockType = null;
      }
    }
  }

  nipStringCache.set(key, { version: document.version, matches });
  return matches;
}
