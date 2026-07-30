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

// Regex patterns for detecting NIP strings in JS/TS files.
// String bodies must keep the escape branch and the plain-char branch DISJOINT
// ((?:\\.|(?!\1)[^\\\r\n])*) - if the plain-char branch can also eat a backslash, the scan
// backtracks exponentially on backslash-dense lines with an unclosed quote candidate and
// freezes the extension host (kolbot's ControlBot.js has a 32-backslash regex line with a
// backtick that never finishes under the overlapping form).
const JSDOC_TYPE_PATTERN = /@type\s*\{(NipString(?:\[\])?|Record<string,\s*NipString(?:\[\])?>)\}/;
const INLINE_NIP_JSDOC = /\/\*\*\s*nip\s*\*\/\s*(["'`])((?:\\.|(?!\1)[^\\\r\n])*)\1/i;
// Matches a line that ends with a standalone `// nip` annotation (possibly preceded by other code)
const LINE_ENDS_WITH_NIP = /\/\/\s*nip\s*$/i;
const TRAILING_COMMENT_NIP = /(["'`])((?:\\.|(?!\1)[^\\\r\n])*)\1\s*,?\s*\/\/\s*nip\s*$/i;
const FIRST_STRING_LITERAL = /(["'`])((?:\\.|(?!\1)[^\\\r\n])*)\1/;
const STRING_LITERAL = /(["'`])((?:\\.|(?!\1)[^\\\r\n])*)\1/g;

// Every regex the scanner runs against document lines. New scan regexes MUST be added here -
// the test suite's ReDoS canaries iterate this registry.
export const SCANNER_REGEXES: ReadonlyArray<{ name: string; regex: RegExp }> = [
  { name: "JSDOC_TYPE_PATTERN", regex: JSDOC_TYPE_PATTERN },
  { name: "INLINE_NIP_JSDOC", regex: INLINE_NIP_JSDOC },
  { name: "LINE_ENDS_WITH_NIP", regex: LINE_ENDS_WITH_NIP },
  { name: "TRAILING_COMMENT_NIP", regex: TRAILING_COMMENT_NIP },
  { name: "FIRST_STRING_LITERAL", regex: FIRST_STRING_LITERAL },
  { name: "STRING_LITERAL", regex: STRING_LITERAL },
];

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
        const startColumn = line.indexOf(stringMatch[0]) + 1; // +1 to skip the quote
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
      const fullMatch = inlineMatch[0];
      const matchIndex = line.indexOf(fullMatch);
      const stringStart = line.indexOf(content, matchIndex);
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
      const stringStart = line.indexOf(content);
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
          const targetLineText = lines[targetLine];
          const stringStart = targetLineText.indexOf(content);
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
      const lineForDepth = line
        .replace(/\/\*\*.*?\*\//g, "")
        .replace(/^\s*\*\/\s*$/, "")
        .replace(/^\s*\*.*$/, "");

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
