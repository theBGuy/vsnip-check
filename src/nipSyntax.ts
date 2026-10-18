// NIP line helpers with no vscode imports, so they are unit-tested directly in
// src/test/nipSyntax.test.ts. No regexes: they run on every keystroke and must
// stay linear on any input.

// kolbot cuts a NIP line at its first `//` without looking at quotes (NTItemParser.js
// ParseLineInt), so nothing after it is parsed. Item names such as hunter'sbow
// contain apostrophes, which a quote-aware cut would read as an opening quote.
export function stripNipComment(line: string): string {
  const start = line.indexOf("//");
  return start === -1 ? line : line.slice(0, start);
}

// Accepts a comma only when the innermost open parenthesis follows a name, as in a call's
// arguments or an in/notin list. kolbot runs tier expressions as JavaScript, so any function name
// counts. kolbot splits a line on `#` before parsing it, so parentheses never span sections.
export function findUnexpectedCommas(line: string): number[] {
  const offsets: number[] = [];
  const parenFollowsName: boolean[] = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "(") parenFollowsName.push(followsName(line, i));
    else if (ch === ")") parenFollowsName.pop();
    else if (ch === "#") parenFollowsName.length = 0;
    else if (ch === "," && !parenFollowsName.at(-1)) offsets.push(i);
  }
  return offsets;
}

// kolbot strips all whitespace before parsing, so any of it may sit between a name and its
// parenthesis; trim() removes the same characters as the regex class \s.
function followsName(line: string, parenIndex: number): boolean {
  let end = parenIndex;
  while (end > 0 && line[end - 1].trim() === "") end--;
  let start = end;
  while (start > 0 && isNameChar(line.charCodeAt(start - 1))) start--;
  return start < end && !isDigit(line.charCodeAt(start));
}

function isDigit(code: number): boolean {
  return code >= 48 && code <= 57;
}

function isNameChar(code: number): boolean {
  return (
    isDigit(code) ||
    (code >= 65 && code <= 90) || // A-Z
    (code >= 97 && code <= 122) || // a-z
    code === 95 || // _
    code === 36 // $
  );
}
