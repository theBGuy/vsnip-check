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
  vscode.workspace.onDidOpenTextDocument((document) => validateTextDocument(document, diagnosticCollection));
  vscode.workspace.onDidSaveTextDocument((document) => validateTextDocument(document, diagnosticCollection));
  vscode.workspace.onDidChangeTextDocument((event) => validateTextDocument(event.document, diagnosticCollection));
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

  const idsProviderJS = vscode.languages.registerCompletionItemProvider(
    "javascript",
    {
      provideCompletionItems(document, position, token, context) {
        try {
          console.log(`Inside js id providers: ${document.languageId}`);
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
  context.subscriptions.push(propsAndStatsProvider, idsProvider);
  context.subscriptions.push(idsProviderJS);
}
