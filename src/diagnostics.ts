import * as vscode from "vscode";
import {
  NTIPAliasClass,
  NTIPAliasClassID,
  NTIPAliasColor,
  NTIPAliasFlag,
  NTIPAliasQuality,
  NTIPAliasStat,
  NTIPAliasType,
} from "./NTItemAlias.js";

// Interfaces for JS/TS NIP string detection
interface NipStringMatch {
  content: string; // The NIP string content (without quotes)
  lineNumber: number; // Line number in the document
  startColumn: number; // Start column of the string content (after the quote)
  endColumn: number; // End column of the string content (before the quote)
}

interface NipDiagnosticResult {
  message: string;
  startOffset: number; // Relative to string start
  endOffset: number; // Relative to string start
}

const JS_LANGUAGES = ["javascript", "typescript", "javascriptreact", "typescriptreact"];

// Regex patterns for detecting NIP strings in JS/TS files
const JSDOC_TYPE_PATTERN = /\/\*\*\s*@type\s*\{(NipString(?:\[\])?|Record<string,\s*NipString>)\}\s*\*\//;
const INLINE_NIP_JSDOC = /\/\*\*\s*nip\s*\*\/\s*["'`]([^"'`]+)["'`]/i;
const LINE_COMMENT_NIP_ABOVE = /^\s*\/\/\s*nip\s*$/i;
const TRAILING_COMMENT_NIP = /["'`]([^"'`]+)["'`]\s*,?\s*\/\/\s*nip\s*$/i;
const STRING_LITERAL = /["'`]([^"'`]+)["'`]/g;

/**
 * Finds all NIP strings in a JavaScript/TypeScript document based on annotations.
 */
function findNipStringsInJS(document: vscode.TextDocument): NipStringMatch[] {
  const matches: NipStringMatch[] = [];
  const text = document.getText();
  const lines = text.split(/\r?\n/);

  let inNipBlock = false; // True when inside a @type {NipString[]} or @type {Record<string, NipString>} block
  let blockDepth = 0; // Track { } and [ ] depth for blocks
  let blockType: "array" | "object" | null = null;
  let nextLineIsNip = false; // True when previous line was // nip

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    // Pattern 1: Check if previous line was // nip
    if (nextLineIsNip) {
      nextLineIsNip = false;
      const stringMatch = line.match(/["'`]([^"'`]+)["'`]/);
      if (stringMatch?.[1]) {
        const content = stringMatch[1];
        const startColumn = line.indexOf(stringMatch[0]) + 1; // +1 to skip the quote
        matches.push({
          content,
          lineNumber: lineNum,
          startColumn,
          endColumn: startColumn + content.length,
        });
      }
    }

    // Check for // nip comment (marks next line)
    if (LINE_COMMENT_NIP_ABOVE.test(line)) {
      nextLineIsNip = true;
      continue;
    }

    // Pattern 2: /** nip */ inline before string
    const inlineMatch = line.match(INLINE_NIP_JSDOC);
    if (inlineMatch?.[1]) {
      const content = inlineMatch[1];
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

    // Pattern 7: Trailing // nip comment on same line
    const trailingMatch = line.match(TRAILING_COMMENT_NIP);
    if (trailingMatch?.[1] && !inNipBlock) {
      const content = trailingMatch[1];
      const stringStart = line.indexOf(content);
      matches.push({
        content,
        lineNumber: lineNum,
        startColumn: stringStart,
        endColumn: stringStart + content.length,
      });
      continue;
    }

    // Patterns 3, 4, 5: JSDoc @type annotations
    const typeMatch = line.match(JSDOC_TYPE_PATTERN);
    if (typeMatch) {
      const typeAnnotation = typeMatch[1];

      if (typeAnnotation === "NipString") {
        // Pattern 3: Single NipString - look for string on this line or next line
        let stringMatch = line.match(/["'`]([^"'`]+)["'`]/);
        let targetLine = lineNum;

        if (!stringMatch && lineNum + 1 < lines.length) {
          stringMatch = lines[lineNum + 1].match(/["'`]([^"'`]+)["'`]/);
          targetLine = lineNum + 1;
        }

        if (stringMatch?.[1]) {
          const content = stringMatch[1];
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
      // Count opening and closing brackets/braces
      for (const ch of line) {
        if (blockType === "array" && ch === "[") blockDepth++;
        if (blockType === "array" && ch === "]") blockDepth--;
        if (blockType === "object" && ch === "{") blockDepth++;
        if (blockType === "object" && ch === "}") blockDepth--;
      }

      // Extract all strings on this line when inside the block
      if (blockDepth > 0) {
        STRING_LITERAL.lastIndex = 0;
        let strMatch: RegExpExecArray | null;
        while ((strMatch = STRING_LITERAL.exec(line)) !== null) {
          const content = strMatch[1];
          // Skip if this looks like an object key (followed by :)
          const afterMatch = line.slice(strMatch.index + strMatch[0].length).trim();
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
      if (blockDepth <= 0 && (line.includes("]") || line.includes("}"))) {
        inNipBlock = false;
        blockType = null;
      }
    }
  }

  return matches;
}

/**
 * Validates NIP strings embedded in JavaScript/TypeScript files.
 */
function validateJSNipStrings(document: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection): void {
  if (!JS_LANGUAGES.includes(document.languageId)) {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];
  const nipStrings = findNipStringsInJS(document);

  for (const match of nipStrings) {
    const validationResults = validateNipString(match.content, match.content);

    for (const result of validationResults) {
      const range = new vscode.Range(
        match.lineNumber,
        match.startColumn + result.startOffset,
        match.lineNumber,
        match.startColumn + result.endOffset,
      );
      diagnostics.push(new vscode.Diagnostic(range, result.message));
    }
  }

  diagnosticCollection.set(document.uri, diagnostics);
}

function isSyntaxInt(ch: string) {
  return (
    ch === "!" ||
    ch === "%" ||
    ch === "&" ||
    (ch >= "(" && ch <= "+") ||
    ch === "-" ||
    ch === "/" ||
    (ch >= ":" && ch <= "?") ||
    ch === "|"
  );
}

function isKeyword(str: string) {
  return str === "in" || str === "notin";
}

const validProperties = [
  "classid",
  "name",
  "type",
  "class",
  "quality",
  "charlvl",
  "level",
  "flag",
  "wsm",
  "weaponspeed",
  "minimumsockets",
  "strreq",
  "dexreq",
  "2handed",
  "color",
  "europe",
  "uswest",
  "useast",
  "asia",
  "ladder",
  "hardcore",
  "classic",
  "distance",
  "prefix",
  "suffix",
  "n",
  "id",
  "t",
  "q",
  "lvl",
  "ilvl",
  "f",
  "hc",
  "cl",
  "clvl",
];

function isValidProperty(property: string) {
  return validProperties.includes(property);
}

function isValidExtra(property: string) {
  return ["tier", "merctier", "charmtier", "maxquantity", "mq"].includes(property);
}

const _lists = new Map([
  ["color", NTIPAliasColor],
  ["type", NTIPAliasType],
  ["name", NTIPAliasClassID],
  ["classid", NTIPAliasClassID],
  ["class", NTIPAliasClass],
  ["quality", NTIPAliasQuality],
  ["flag", NTIPAliasFlag],
  ["stat", NTIPAliasStat],
]);

const _aliases = new Map([
  ["n", "name"],
  ["id", "classid"],
  ["t", "type"],
  ["q", "quality"],
  ["lvl", "level"],
  ["ilvl", "level"],
  ["f", "flag"],
  ["hc", "hardcore"],
  ["cl", "classic"],
  ["clvl", "charlvl"],
]);

/**
 * Validates a single NIP string and returns diagnostic results with relative offsets.
 * This is used for validating NIP strings embedded in JS/TS files.
 */
function validateNipString(nipLine: string, originalLine: string): NipDiagnosticResult[] {
  const results: NipDiagnosticResult[] = [];
  const line = nipLine.replace(/\s+/g, "").toLowerCase();

  if (line.length < 5) return results;

  const sections = line.split("#");

  for (let j = 0; j < sections.length; j++) {
    const lineSection = sections[j];

    // Check for matching brackets
    const openBracketCount = (lineSection.match(/\[/g) || []).length;
    const closeBracketCount = (lineSection.match(/\]/g) || []).length;
    if (openBracketCount !== closeBracketCount) {
      results.push({
        message: "Mismatched brackets",
        startOffset: 0,
        endOffset: originalLine.length,
      });
    }

    // Check for matching parentheses
    const openParenCount = (lineSection.match(/\(/g) || []).length;
    const closeParenCount = (lineSection.match(/\)/g) || []).length;
    if (openParenCount !== closeParenCount) {
      results.push({
        message: "Mismatched parentheses",
        startOffset: 0,
        endOffset: originalLine.length,
      });
    }

    if (j === 0 && lineSection.length > 4) {
      // Properties section
      let p_start = 0;
      const p_section = (parseAliasIn.test(lineSection) ? parseAliasIn.convert(lineSection) : lineSection).split("[");
      const section = originalLine.split("#").at(0) || "";

      for (let k = 1; k < p_section.length; k++) {
        let p_end = p_section[k].indexOf("]") + 1;
        let property = p_section[k].substring(0, p_end - 1);
        const _property = property;
        const propIdx = section.toLowerCase().indexOf(`[${_property}]`);

        if (_aliases.has(property)) {
          property = _aliases.get(property) as string;
        }

        if (!isValidProperty(property)) {
          results.push({
            message: `Invalid property: ${_property}`,
            startOffset: propIdx >= 0 ? propIdx + 1 : 0,
            endOffset: propIdx >= 0 ? propIdx + 1 + _property.length : _property.length,
          });
        }

        for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
          if (!isSyntaxInt(p_section[k][p_end])) {
            break;
          }
        }

        if (p_section[k].substring(p_start, p_end) === "=") {
          const startIdx = propIdx >= 0 ? propIdx + _property.length + 2 : 0;
          results.push({
            message: `[${_property}] has invalid assignment operator '=' (properties)`,
            startOffset: startIdx,
            endOffset: startIdx + 3,
          });
        }

        for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
          if (isSyntaxInt(p_section[k][p_end])) {
            break;
          }
        }

        if (isKeyword(p_section[k].substring(p_start, p_end))) {
          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }
        }
        const p_keyword = p_section[k].substring(p_start, p_end);

        if (Number.isNaN(Number(p_keyword))) {
          const list = _lists.get(property);
          if (list && !(p_keyword in list)) {
            const keywordIdx = section.toLowerCase().indexOf(p_keyword);
            results.push({
              message: `Unknown keyword: ${p_keyword}`,
              startOffset: keywordIdx >= 0 ? keywordIdx : 0,
              endOffset: keywordIdx >= 0 ? keywordIdx + p_keyword.length : p_keyword.length,
            });
          }
        }
      }
    } else if (j === 1 && lineSection.length > 4) {
      // Stats section
      let p_start = 0;
      const section = originalLine.split("#").at(1) || "";
      const sectionIndex = originalLine.indexOf("#");
      const p_section = lineSection.split("[");

      for (let k = 1; k < p_section.length; k++) {
        let p_end = p_section[k].indexOf("]") + 1;
        const stat = p_section[k].substring(0, p_end - 1);
        const statIdx = 1 + sectionIndex + section.toLowerCase().indexOf(`[${stat}]`);

        if (Number.isNaN(Number(stat))) {
          // biome-ignore lint/suspicious/noPrototypeBuiltins: checking if stat exists
          if (!NTIPAliasStat.hasOwnProperty(stat)) {
            results.push({
              message: `Unknown stat: ${stat}`,
              startOffset: statIdx >= 0 ? statIdx + 1 : 0,
              endOffset: statIdx >= 0 ? statIdx + 1 + stat.length : stat.length,
            });
          }
        }

        for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
          if (!isSyntaxInt(p_section[k][p_end])) {
            break;
          }
        }

        if (p_section[k].substring(p_start, p_end) === "=") {
          const startIdx = statIdx >= 0 ? statIdx + stat.length + 2 : 0;
          results.push({
            message: `[${stat}] has invalid assignment operator '=' (stats)`,
            startOffset: startIdx,
            endOffset: startIdx + 3,
          });
        }
      }
    } else if (j >= 2) {
      // Extras section
      let p_start = 0;
      const section = originalLine.split("#").at(-1) || "";
      const sectionIndex = originalLine.lastIndexOf("#");
      const p_section = lineSection.split("[");

      for (let k = 1; k < p_section.length; k++) {
        let p_end = p_section[k].indexOf("]") + 1;
        const property = p_section[k].substring(0, p_end - 1);
        const propIdx = 1 + sectionIndex + section.toLowerCase().indexOf(`[${property}]`);

        if (!isValidExtra(property)) {
          results.push({
            message: `Invalid extra: ${property}`,
            startOffset: propIdx >= 0 ? propIdx + 1 : 0,
            endOffset: propIdx >= 0 ? propIdx + 1 + property.length : property.length,
          });
        }

        for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
          if (!isSyntaxInt(p_section[k][p_end])) {
            break;
          }
        }

        if (p_section[k].substring(p_start, p_end) === "=") {
          const startIdx = propIdx >= 0 ? propIdx + property.length + 2 : 0;
          results.push({
            message: `[${property}] has invalid assignment operator '=' (extras)`,
            startOffset: startIdx,
            endOffset: startIdx + 3,
          });
        }
      }
    }
  }

  return results;
}

// kinda hacky but it works
const parseAliasIn = {
  in: "[([^]]+)]in(",
  notin: "[([^]]+)]notin(",
  /** @private */
  _regex: new RegExp(/\[([^\]]+)\](in|notin)\(/gi),

  /**
   * @param {string} input
   * @returns {boolean}
   */
  test: function (input: string): boolean {
    this._regex.lastIndex = 0;
    return this._regex.test(input);
  },
  /**
   * @param {string} input
   * @returns {string}
   */
  convert: (input: string): string => {
    const regex = new RegExp(/\[([^\]]+)\](in|notin)\(([^)]+)\)/g);
    let match: RegExpExecArray | null;
    let result = input;
    while ((match = regex.exec(input)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      const [_full, property, type, values] = match;
      if (!property || !values) throw new Error("Invalid syntax");
      const alias = `(${values
        .split(",")
        .filter((el) => el.trim().length > 0)
        .map((el) => `[${property}]${type === "in" ? "==" : "!="}${el.trim()}`)
        .join(type === "in" ? "||" : "&&")})`;
      result = result.replace(match[0], alias);
    }
    return result;
  },
};

function validateTextDocument(textDocument: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection) {
  if (textDocument.languageId !== "nip") {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];
  const lines = textDocument.getText().split(/\r?\n/g);

  for (let i = 0; i < lines.length; i++) {
    const commentIndex = lines[i].indexOf("//");

    if (commentIndex !== -1) {
      lines[i] = lines[i].slice(0, commentIndex);
    }

    const line = lines[i].replace(/\s+/g, "").toLowerCase();
    if (line.length < 5) continue;
    const sections = line.split("#");

    for (let j = 0; j < sections.length; j++) {
      const lineSection = sections[j];
      // Check for matching brackets
      const openBracketCount = (lineSection.match(/\[/g) || []).length;
      const closeBracketCount = (lineSection.match(/\]/g) || []).length;
      if (openBracketCount !== closeBracketCount) {
        diagnostics.push(new vscode.Diagnostic(new vscode.Range(i, 0, i, lineSection.length), "Mismatched brackets"));
      }

      // Check for matching parentheses
      const openParenCount = (lineSection.match(/\(/g) || []).length;
      const closeParenCount = (lineSection.match(/\)/g) || []).length;
      if (openParenCount !== closeParenCount) {
        diagnostics.push(
          new vscode.Diagnostic(new vscode.Range(i, 0, i, lineSection.length), "Mismatched parentheses"),
        );
      }

      if (j === 0 && lineSection.length > 4) {
        let p_start = 0;
        const p_section = (parseAliasIn.test(lineSection) ? parseAliasIn.convert(lineSection) : lineSection).split("[");
        const section = lines[i].split("#").at(0) || "";

        for (let k = 1; k < p_section.length; k++) {
          let p_end = p_section[k].indexOf("]") + 1;
          let property = p_section[k].substring(0, p_end - 1);
          const _property = property;
          const propIdx = section.indexOf(`[${_property}]`);

          if (_aliases.has(property)) {
            // @ts-ignore - TS doesn't know that the key exists even though we check it above
            property = _aliases.get(property);
          }

          if (!isValidProperty(property)) {
            diagnostics.push(
              new vscode.Diagnostic(
                new vscode.Range(i, propIdx, i, propIdx + _property.length),
                `Invalid property: ${_property}`,
              ),
            );
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (!isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          if (p_section[k].substring(p_start, p_end) === "=") {
            const startIdx = propIdx + _property.length + 2;
            diagnostics.push(
              new vscode.Diagnostic(
                new vscode.Range(i, startIdx, i, startIdx + 3),
                `[${_property}] has invalid assignment operator '=' (properties)`,
              ),
            );
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          if (isKeyword(p_section[k].substring(p_start, p_end))) {
            for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
              if (isSyntaxInt(p_section[k][p_end])) {
                break;
              }
            }
          }
          const p_keyword = p_section[k].substring(p_start, p_end);

          if (Number.isNaN(Number(p_keyword))) {
            const list = _lists.get(property);
            if (list && !(p_keyword in list)) {
              const startIdx = propIdx + _property.length - 1 + p_start;
              diagnostics.push(
                new vscode.Diagnostic(
                  new vscode.Range(i, startIdx, i, startIdx + p_keyword.length),
                  `Unknown keyword: ${p_keyword}`,
                ),
              );
            }
          }
        }
      } else if (j === 1 && lineSection.length > 4) {
        let p_start = 0;
        const section = lines[i].split("#").at(1) || "";
        const sectionIndex = lines[i].indexOf("#");
        const p_section = lineSection.split("[");

        for (let k = 1; k < p_section.length; k++) {
          let p_end = p_section[k].indexOf("]") + 1;
          const stat = p_section[k].substring(0, p_end - 1);
          const statIdx = 1 + sectionIndex + section.indexOf(`[${stat}]`);

          if (Number.isNaN(Number(stat))) {
            // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
            if (!NTIPAliasStat.hasOwnProperty(stat)) {
              diagnostics.push(
                new vscode.Diagnostic(new vscode.Range(i, statIdx, i, statIdx + stat.length), `Unknown stat: ${stat}`),
              );
            }
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (!isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          if (p_section[k].substring(p_start, p_end) === "=") {
            const startIdx = statIdx + stat.length + 2;
            diagnostics.push(
              new vscode.Diagnostic(
                new vscode.Range(i, startIdx, i, startIdx + 3),
                `[${stat}] has invalid assignment operator '=' (stats)`,
              ),
            );
          }
        }
      } else {
        let p_start = 0;
        const section = lines[i].split("#").at(-1) || "";
        const sectionIndex = lines[i].lastIndexOf("#");
        const p_section = lineSection.split("[");

        for (let k = 1; k < p_section.length; k++) {
          let p_end = p_section[k].indexOf("]") + 1;
          const property = p_section[k].substring(0, p_end - 1);
          const propIdx = 1 + sectionIndex + section.indexOf(`[${property}]`);

          if (!isValidExtra(property)) {
            diagnostics.push(
              new vscode.Diagnostic(
                new vscode.Range(i, propIdx, i, propIdx + property.length),
                `Invalid extra: ${property}`,
              ),
            );
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (!isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          if (p_section[k].substring(p_start, p_end) === "=") {
            const startIdx = propIdx + property.length + 2;
            diagnostics.push(
              new vscode.Diagnostic(
                new vscode.Range(i, startIdx, i, startIdx + 3),
                `[${property}] has invalid assignment operator '=' (extras)`,
              ),
            );
          }
        }
      }
    }
  }

  diagnosticCollection.set(textDocument.uri, diagnostics);
}

export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection("vsnip-check");
  // context.subscriptions.push(
  //   vscode.languages.registerCodeActionsProvider(
  //     'nip',
  //     {
  //       provideCodeActions: (document, range, context, token) => {
  //         const diagnostic = context.diagnostics[0];
  //         if (diagnostic.code === 'Mismatched brackets') {
  //           const fix = new vscode.CodeAction('Remove mismatched brackets', vscode.CodeActionKind.QuickFix);
  //           fix.edit = new vscode.WorkspaceEdit();
  //           fix.edit.delete(document.uri, diagnostic.range);
  //           return [fix];
  //         }
  //       }
  //     }
  //   )
  // );
  vscode.workspace.onDidOpenTextDocument((document) => {
    validateTextDocument(document, diagnosticCollection);
    validateJSNipStrings(document, diagnosticCollection);
  });
  vscode.workspace.onDidSaveTextDocument((document) => {
    validateTextDocument(document, diagnosticCollection);
    validateJSNipStrings(document, diagnosticCollection);
  });
  vscode.workspace.onDidChangeTextDocument((event) => {
    validateTextDocument(event.document, diagnosticCollection);
    validateJSNipStrings(event.document, diagnosticCollection);
  });
  vscode.workspace.onDidCloseTextDocument((document) => diagnosticCollection.delete(document.uri));

  const alphas = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "o",
    "p",
    "q",
    "r",
    "s",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const numerics = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const propsAndStatsProvider = vscode.languages.registerCompletionItemProvider(
    "nip",
    {
      provideCompletionItems(document, position, token, context) {
        try {
          const completionItems: vscode.CompletionItem[] = [];
          const line = document.lineAt(position).text;
          const linePrefix = line.slice(0, position.character);
          const lineSuffix = line.slice(position.character);

          // Check if the cursor is inside a double-quoted string
          const isInsideDoubleQuotes =
            (linePrefix.match(/"/g) || []).length % 2 === 1 && (lineSuffix.match(/"/g) || []).length % 2 === 1;
          // console.log(`Language ${document.languageId}, is in double quotes? ${isInsideDoubleQuotes}`);
          if (document.languageId === "javascript" && !isInsideDoubleQuotes) {
            return completionItems;
          }

          // We need to determine if we are inside a pair of brackets
          let foundOpenBracket = false;
          let foundCloseBracket = false;

          for (let i = linePrefix.length - 1; i >= 0; i--) {
            if (linePrefix[i] === "[") {
              foundOpenBracket = true;
              break;
            }
            if (!/\w/.test(linePrefix[i])) {
              return completionItems;
            }
          }
          if (!foundOpenBracket) return completionItems;

          for (let i = 0; i < lineSuffix.length; i++) {
            if (lineSuffix[i] === "]") {
              foundCloseBracket = true;
              break;
            }
            if (!/\w/.test(lineSuffix[i])) {
              return completionItems;
            }
          }
          if (!foundCloseBracket) return completionItems;

          const segments = line.split("#");

          // Find which segment the cursor is in
          let segmentIndex = 0;
          let characterCount = 0;
          for (let i = 0; i < segments.length; i++) {
            characterCount += segments[i].length;
            if (position.character <= characterCount) {
              segmentIndex = i;
              break;
            }
            characterCount += 1;
          }

          if (segmentIndex === 0) {
            for (const val of validProperties) {
              const completionItem = new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword);
              if (_aliases.has(val)) {
                // @ts-ignore
                completionItem.detail = _aliases.get(val);
              }
              completionItems.push(completionItem);
            }
          } else if (segmentIndex === 1) {
            for (const val of Object.keys(NTIPAliasStat)) {
              completionItems.push(new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword));
            }
          } else {
            for (const val of ["tier", "merctier", "charmtier", "maxquantity", "mq"]) {
              completionItems.push(new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword));
            }
          }
          return completionItems;
        } catch (e) {
          console.error(e);
        }
      },
    },
    ...alphas,
    ...numerics,
    "[",
  );

  const idsProvider = vscode.languages.registerCompletionItemProvider(
    "nip",
    {
      provideCompletionItems(document, position, token, context) {
        try {
          const completionItems: vscode.CompletionItem[] = [];
          const line = document.lineAt(position).text.slice(0, position.character);
          const segments = line.split("#");

          // Check if the cursor is inside a double-quoted string
          const isInsideDoubleQuotes = (line.match(/"/g) || []).length % 2 === 1;
          console.log(`Language ${document.languageId}, is in double quotes? ${isInsideDoubleQuotes}`);
          if (document.languageId === "javascript" && !isInsideDoubleQuotes) {
            return completionItems;
          }

          // Find which segment the cursor is in
          let segmentIndex = 0;
          let characterCount = 0;
          for (let i = 0; i < segments.length; i++) {
            characterCount += segments[i].length;
            if (position.character <= characterCount) {
              segmentIndex = i;
              break;
            }
            characterCount += 1;
          }
          if (segmentIndex !== 0) return completionItems;

          const matches = segments[0].match(/\[([^\]]+)\]/g);
          if (!matches) return completionItems;

          let property = matches.at(-1)?.slice(1, -1) || "";
          if (_aliases.has(property)) {
            // @ts-ignore
            property = _aliases.get(property);
          }
          if (!_lists.has(property)) return completionItems;

          const list = _lists.get(property);
          if (!list) return completionItems;

          for (const val of Object.keys(list)) {
            if (["notused", "unused"].includes(val)) continue;
            const completionItem = new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword);
            if (val.length === 3) {
              // we are dealing with the item code, find the corresponding name
              for (const [key, value] of Object.entries(list)) {
                if (value === list[val] && key !== val) {
                  completionItem.detail = key;
                  break;
                }
              }
            }
            completionItems.push(completionItem);
          }
          return completionItems;
        } catch (e) {
          console.error(e);
        }
      },
    },
    ...alphas,
  );

  // Props and Stats completion provider for JS/TS languages (inside brackets [])
  const jstsPropsAndStatsProvider = {
    provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      _token: vscode.CancellationToken,
      _context: vscode.CompletionContext,
    ) {
      try {
        const completionItems: vscode.CompletionItem[] = [];
        const line = document.lineAt(position).text;
        const linePrefix = line.slice(0, position.character);
        const lineSuffix = line.slice(position.character);

        // Check if the cursor is inside a quoted string
        const isInsideDoubleQuotes =
          (linePrefix.match(/"/g) || []).length % 2 === 1 && (lineSuffix.match(/"/g) || []).length % 2 === 1;
        const isInsideSingleQuotes =
          (linePrefix.match(/'/g) || []).length % 2 === 1 && (lineSuffix.match(/'/g) || []).length % 2 === 1;
        if (!isInsideDoubleQuotes && !isInsideSingleQuotes) {
          return completionItems;
        }

        // We need to determine if we are inside a pair of brackets
        let foundOpenBracket = false;
        let foundCloseBracket = false;

        for (let i = linePrefix.length - 1; i >= 0; i--) {
          if (linePrefix[i] === "[") {
            foundOpenBracket = true;
            break;
          }
          if (!/\w/.test(linePrefix[i])) {
            return completionItems;
          }
        }
        if (!foundOpenBracket) return completionItems;

        for (let i = 0; i < lineSuffix.length; i++) {
          if (lineSuffix[i] === "]") {
            foundCloseBracket = true;
            break;
          }
          if (!/\w/.test(lineSuffix[i])) {
            return completionItems;
          }
        }
        if (!foundCloseBracket) return completionItems;

        const segments = line.split("#");

        // Find which segment the cursor is in
        let segmentIndex = 0;
        let characterCount = 0;
        for (let i = 0; i < segments.length; i++) {
          characterCount += segments[i].length;
          if (position.character <= characterCount) {
            segmentIndex = i;
            break;
          }
          characterCount += 1;
        }

        if (segmentIndex === 0) {
          for (const val of validProperties) {
            const completionItem = new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword);
            if (_aliases.has(val)) {
              // @ts-ignore
              completionItem.detail = _aliases.get(val);
            }
            completionItems.push(completionItem);
          }
        } else if (segmentIndex === 1) {
          for (const val of Object.keys(NTIPAliasStat)) {
            completionItems.push(new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword));
          }
        } else {
          for (const val of ["tier", "merctier", "charmtier", "maxquantity", "mq"]) {
            completionItems.push(new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword));
          }
        }
        return completionItems;
      } catch (e) {
        console.error(e);
      }
    },
  };

  // IDs completion provider for JS/TS languages (property values like item names, types, etc.)
  const jstsIdsProvider = {
    provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      _token: vscode.CancellationToken,
      _context: vscode.CompletionContext,
    ) {
      try {
        const completionItems: vscode.CompletionItem[] = [];
        const line = document.lineAt(position).text.slice(0, position.character);
        const segments = line.split("#");

        // Check if the cursor is inside a quoted string
        const isInsideDoubleQuotes = (line.match(/"/g) || []).length % 2 === 1;
        const isInsideSingleQuotes = (line.match(/'/g) || []).length % 2 === 1;
        if (!isInsideDoubleQuotes && !isInsideSingleQuotes) {
          return completionItems;
        }

        // Find which segment the cursor is in
        let segmentIndex = 0;
        let characterCount = 0;
        for (let i = 0; i < segments.length; i++) {
          characterCount += segments[i].length;
          if (position.character <= characterCount) {
            segmentIndex = i;
            break;
          }
          characterCount += 1;
        }
        if (segmentIndex !== 0) return completionItems;

        const matches = segments[0].match(/\[([^\]]+)\]/g);
        if (!matches) return completionItems;

        let property = matches.at(-1)?.slice(1, -1) || "";
        if (_aliases.has(property)) {
          // @ts-ignore
          property = _aliases.get(property);
        }
        if (!_lists.has(property)) return completionItems;

        const list = _lists.get(property);
        if (!list) return completionItems;

        for (const val of Object.keys(list)) {
          if (["notused", "unused"].includes(val)) continue;
          const completionItem = new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword);
          if (val.length === 3) {
            // we are dealing with the item code, find the corresponding name
            for (const [key, value] of Object.entries(list)) {
              if (value === list[val] && key !== val) {
                completionItem.detail = key;
                break;
              }
            }
          }
          completionItems.push(completionItem);
        }
        return completionItems;
      } catch (e) {
        console.error(e);
      }
    },
  };

  // Register props/stats completion providers for all JS/TS languages
  const propsProviderJS = vscode.languages.registerCompletionItemProvider(
    "javascript",
    jstsPropsAndStatsProvider,
    ...alphas,
    ...numerics,
    "[",
  );
  const propsProviderTS = vscode.languages.registerCompletionItemProvider(
    "typescript",
    jstsPropsAndStatsProvider,
    ...alphas,
    ...numerics,
    "[",
  );
  const propsProviderJSX = vscode.languages.registerCompletionItemProvider(
    "javascriptreact",
    jstsPropsAndStatsProvider,
    ...alphas,
    ...numerics,
    "[",
  );
  const propsProviderTSX = vscode.languages.registerCompletionItemProvider(
    "typescriptreact",
    jstsPropsAndStatsProvider,
    ...alphas,
    ...numerics,
    "[",
  );

  // Register IDs completion providers for all JS/TS languages
  const idsProviderJS = vscode.languages.registerCompletionItemProvider("javascript", jstsIdsProvider, ...alphas);
  const idsProviderTS = vscode.languages.registerCompletionItemProvider("typescript", jstsIdsProvider, ...alphas);
  const idsProviderJSX = vscode.languages.registerCompletionItemProvider("javascriptreact", jstsIdsProvider, ...alphas);
  const idsProviderTSX = vscode.languages.registerCompletionItemProvider("typescriptreact", jstsIdsProvider, ...alphas);

  context.subscriptions.push(propsAndStatsProvider, idsProvider);
  context.subscriptions.push(propsProviderJS, propsProviderTS, propsProviderJSX, propsProviderTSX);
  context.subscriptions.push(idsProviderJS, idsProviderTS, idsProviderJSX, idsProviderTSX);
}
