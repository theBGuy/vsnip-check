// NIP line checks with no vscode imports, so they are unit-tested directly
// (src/test/nipSyntax.test.ts). Character walks, not regexes: they run on every keystroke and
// must stay linear on any input.

// A comma is valid only between the arguments of a call or the items of an in/notin list, so the
// innermost open parenthesis must follow a name. kolbot runs tier expressions as JavaScript, so a
// call to any function qualifies.
export function findUnexpectedCommas(line: string): number[] {
  const offsets: number[] = [];
  const parenFollowsName: boolean[] = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "(") parenFollowsName.push(followsName(line, i));
    else if (ch === ")") parenFollowsName.pop();
    else if (ch === "," && !parenFollowsName.at(-1)) offsets.push(i);
  }
  return offsets;
}

function followsName(line: string, parenIndex: number): boolean {
  let end = parenIndex;
  while (end > 0 && (line[end - 1] === " " || line[end - 1] === "\t")) end--;
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
