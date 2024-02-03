import * as vscode from 'vscode';
import {
  NTIPAliasType,
  NTIPAliasClassID,
  NTIPAliasStat,
  NTIPAliasQuality,
  NTIPAliasClass,
  NTIPAliasFlag,
  NTIPAliasColor,
} from './NTItemAlias.js';

function isSyntaxInt (ch: string) {
  return (
    ch === "!"
    || ch === "%"
    || ch === "&"
    || (ch >= "(" && ch <= "+")
    || ch === "-"
    || ch === "/"
    || (ch >= ":" && ch <= "?")
    || ch === "|"
  );
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
  "clvl"
];

function isValidProperty (property: string) {
  return validProperties.includes(property);
}

function isValidExtra (property: string) {
  return [
    "tier",
    "merctier",
    "charmtier",
    "maxquantity",
    "mq",
  ].includes(property);
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

function validateTextDocument(textDocument: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection) {
  if (textDocument.languageId !== 'nip') {
    return;
  }
  
  const diagnostics: vscode.Diagnostic[] = [];
  const lines = textDocument.getText().split(/\r?\n/g);

  for (let i = 0; i < lines.length; i++) {
    let commentIndex = lines[i].indexOf('//');

    if (commentIndex !== -1) {
      lines[i] = lines[i].slice(0, commentIndex);
    }

    const line = lines[i].replace(/\s+/g, "").toLowerCase();
    if (line.length < 5) continue;
    const sections = line.split('#');

    for (let j = 0; j < sections.length; j++) {
      const lineSection = sections[j];
      // Check for matching brackets
      let openBracketCount = (lineSection.match(/\[/g) || []).length;
      let closeBracketCount = (lineSection.match(/\]/g) || []).length;
      if (openBracketCount !== closeBracketCount) {
        diagnostics.push(new vscode.Diagnostic(
          new vscode.Range(i, 0, i, lineSection.length),
          'Mismatched brackets'
        ));
      }

      // Check for matching parentheses
      let openParenCount = (lineSection.match(/\(/g) || []).length;
      let closeParenCount = (lineSection.match(/\)/g) || []).length;
      if (openParenCount !== closeParenCount) {
        diagnostics.push(new vscode.Diagnostic(
          new vscode.Range(i, 0, i, lineSection.length),
          'Mismatched parentheses'
        ));
      }

      if (j === 0 && lineSection.length > 4) {
        let p_start: number = 0;
        let p_section = lineSection.split('[');
        let section = (lines[i].split('#').at(0) || "");

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
            diagnostics.push(new vscode.Diagnostic(
              new vscode.Range(i, propIdx, i, propIdx + _property.length),
              `Invalid property: ${_property}`
            ));
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (!isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          if (p_section[k].substring(p_start, p_end) === "=") {
            let startIdx = propIdx + _property.length + 2;
            diagnostics.push(new vscode.Diagnostic(
              new vscode.Range(i, startIdx, i, startIdx + 3),
              `[${_property}] has invalid assignment operator '=' (properties)`
            ));
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          let p_keyword = p_section[k].substring(p_start, p_end);

          // hacky-fix for now
          if (p_keyword === _property) continue;

          if (isNaN(Number(p_keyword))) {
            if (!_lists.has(property)) {
              diagnostics.push(new vscode.Diagnostic(
                new vscode.Range(i, 0, i, lineSection.length),
                'Unknown keyword: ' + property
              ));
            } else {
              let list = _lists.get(property);
              if (list && !(p_keyword in list)) {
                diagnostics.push(new vscode.Diagnostic(
                  new vscode.Range(i, 0, i, lineSection.length),
                  'Unknown keyword: ' + property + ': ' + p_keyword
                ));
              }
            }
          }
        }
      } else if (j === 1 && lineSection.length > 4) {
        let section = (lines[i].split('#').at(1) || "");
        let sectionIndex = lines[i].indexOf('#');
        let p_start: number = 0;
        let p_section = lineSection.split('[');

        for (let k = 1; k < p_section.length; k++) {
          let p_end = p_section[k].indexOf("]") + 1;
          let stat = p_section[k].substring(p_start, p_end - 1);
          let statIdx = 1 + sectionIndex + section.indexOf(`[${stat}]`);

          if (isNaN(Number(stat))) {
            if (!NTIPAliasStat.hasOwnProperty(stat)) {
              diagnostics.push(new vscode.Diagnostic(
                new vscode.Range(i, statIdx, i, statIdx + stat.length),
                'Unknown stat: ' + stat
              ));
            }
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (!isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          if (p_section[k].substring(p_start, p_end) === "=") {
            let startIdx = statIdx + stat.length + 2;
            diagnostics.push(new vscode.Diagnostic(
              new vscode.Range(i, startIdx, i, startIdx + 3),
              `[${stat}] has invalid assignment operator '=' (stats)`
            ));
          }
        }
      } else {
        let section = (lines[i].split('#').at(-1) || "");
        let sectionIndex = lines[i].lastIndexOf('#');
        let p_start: number = 0;
        let p_section = lineSection.split('[');

        for (let k = 1; k < p_section.length; k++) {
          let p_end = p_section[k].indexOf("]") + 1;
          let property = p_section[k].substring(0, p_end - 1);
          let propIdx = 1 + sectionIndex + section.indexOf(`[${property}]`);

          if (!isValidExtra(property)) {
            diagnostics.push(new vscode.Diagnostic(
              new vscode.Range(i, propIdx, i, propIdx + property.length),
              `Invalid extra: ${property}`
            ));
          }

          for (p_start = p_end; p_end < p_section[k].length; p_end += 1) {
            if (!isSyntaxInt(p_section[k][p_end])) {
              break;
            }
          }

          if (p_section[k].substring(p_start, p_end) === "=") {
            let startIdx = propIdx + property.length + 2;
            diagnostics.push(new vscode.Diagnostic(
              new vscode.Range(i, startIdx, i, startIdx + 3),
              `[${property}] has invalid assignment operator '=' (extras)`
            ));
          }
        }
      }
    }
  }

  diagnosticCollection.set(textDocument.uri, diagnostics);
}

export function activate(context: vscode.ExtensionContext) {
  let diagnosticCollection = vscode.languages.createDiagnosticCollection('vsnip-check');
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
  vscode.workspace.onDidOpenTextDocument(document => validateTextDocument(document, diagnosticCollection));
  vscode.workspace.onDidSaveTextDocument(document => validateTextDocument(document, diagnosticCollection));
  vscode.workspace.onDidOpenTextDocument(document => validateTextDocument(document, diagnosticCollection));
  vscode.workspace.onDidChangeTextDocument(event => validateTextDocument(event.document, diagnosticCollection));
  vscode.workspace.onDidCloseTextDocument(document => diagnosticCollection.delete(document.uri));
  
  const alphas = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'o', 'p', 'q', 'r', 's', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O', 'P', 'Q', 'R', 'S', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];
  const numerics = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const propsAndStatsProvider = vscode.languages.registerCompletionItemProvider('nip', {
    provideCompletionItems(document, position, token, context) {
      try {
        const completionItems: vscode.CompletionItem[] = [];
        const line = document.lineAt(position).text;
        const linePrefix = line.slice(0, position.character);
        const lineSuffix = line.slice(position.character);
        
        // We need to determine if we are inside a pair of brackets
        let foundOpenBracket = false;
        let foundCloseBracket = false;

        for (let i = linePrefix.length - 1; i >= 0; i--) {
          if (linePrefix[i] === '[') {
            foundOpenBracket = true;
            break;
          }
          if (!/\w/.test(linePrefix[i])) {
            // console.log(`Not a word character: ${linePrefix[i]}`);
            return completionItems;
          }
        }
        if (!foundOpenBracket) return completionItems;

        for (let i = 0; i < lineSuffix.length; i++) {
          if (lineSuffix[i] === ']') {
            foundCloseBracket = true;
            break;
          }
          if (!/\w/.test(lineSuffix[i])) {
            // console.log(`Not a word character: ${lineSuffix[i]}`);
            return completionItems;
          }
        }
        if (!foundCloseBracket) return completionItems;

        const segments = line.split('#');

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
  }, ...alphas, ...numerics, '[');

  const idsProvider = vscode.languages.registerCompletionItemProvider('nip', {
    provideCompletionItems(document, position, token, context) {
      try {
        const completionItems: vscode.CompletionItem[] = [];
        const line = document.lineAt(position).text;
        const segments = line.split('#');

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
          const matches = line.match(/\[([^\]]+)\]/g);
          if (matches) {
            const property = matches.at(-1)?.slice(1, -1);
            // @ts-ignore
            if (!_lists.has(property)) return completionItems;
            // @ts-ignore
            const list = _lists.get(property);
            if (list) {
              for (const val of Object.keys(list)) {
                completionItems.push(new vscode.CompletionItem(val, vscode.CompletionItemKind.Keyword));
              }
            }
          }
        }
        return completionItems;
      }
      catch (e) {
        console.error(e);
      }
    }
  }, ...alphas);
  context.subscriptions.push(propsAndStatsProvider, idsProvider);
}