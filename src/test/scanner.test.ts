import * as assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { before, describe, test } from "node:test";
import {
  clearNipStringCache,
  findNipStringsInJS,
  SCANNER_REGEXES,
  type ScannableDocument,
  stripInlineCommentOutsideStrings,
} from "../scanner.js";

let docCounter = 0;
function doc(text: string, version = 1, uri?: string): ScannableDocument {
  const u = uri ?? `test://doc-${++docCounter}`;
  return { uri: { toString: () => u }, version, getText: () => text };
}

// The line that froze the 1.5.0 extension host for real (kolbot ControlBot.js): a regex literal
// whose character class escapes ~30 specials (backtick and quotes included) - to the scanner it
// reads as an unclosed backslash-dense string. Reconstructed, not copied, so the test is
// self-contained.
const SPECIALS = "'<>[]{}()!@#$%^&*_+=|~`;:\"?,./\\";
const CONTROLBOT_LINE = `          .replace(/[${[...SPECIALS].map((c) => `\\${c}`).join("")}]|plz|please/g, "")`;

const ADVERSARIAL_LINES = [
  CONTROLBOT_LINE,
  `"${"\\".repeat(64)}`, // unclosed quote, pure backslash flood
  `\`${"\\x".repeat(48)}`, // unclosed backtick, escape-pair flood
  `  "a${"\\;".repeat(40)} // not nip`, // unclosed, flood, trailing non-annotation comment
];

describe("ReDoS canaries (every scanner regex x every adversarial line)", () => {
  // A catastrophic regex blocks the event loop synchronously, so an in-process timeout can never
  // fire; each exec therefore runs in a child process that spawnSync can hard-kill.
  function execInChild(source: string, flags: string, input: string): { ok: boolean; ms: number } {
    const t0 = process.hrtime.bigint();
    const res = spawnSync(
      process.execPath,
      ["-e", "new RegExp(process.argv[1], process.argv[2]).exec(process.argv[3])", source, flags, input],
      { timeout: 3000, killSignal: "SIGKILL" },
    );
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    return { ok: res.status === 0 && !res.error, ms };
  }

  for (const { name, regex } of SCANNER_REGEXES) {
    test(`${name} completes on adversarial input`, () => {
      for (const line of ADVERSARIAL_LINES) {
        const { ok, ms } = execInChild(regex.source, regex.flags.replace("g", ""), line);
        assert.ok(ok, `${name} was killed after 3s on: ${line.slice(0, 60)}...`);
        // Process spawn dominates the wall time; the exec itself must be effectively instant.
        assert.ok(ms < 1500, `${name} took ${ms.toFixed(0)}ms on: ${line.slice(0, 60)}...`);
      }
    });
  }

  test("full scan of a 300-line adversarial document is fast and matchless", () => {
    const text = Array(300).fill(CONTROLBOT_LINE).join("\n");
    const t0 = process.hrtime.bigint();
    const matches = findNipStringsInJS(doc(text));
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    assert.equal(matches.length, 0);
    assert.ok(ms < 2000, `scan took ${ms.toFixed(0)}ms`);
  });
});

describe("NIP string detection patterns", () => {
  before(() => clearNipStringCache());

  test("pattern 1: // nip on previous line marks first string of next line", () => {
    const matches = findNipStringsInJS(doc(["// nip", '  "[name] == ring && [quality] == unique",'].join("\n")));
    assert.equal(matches.length, 1);
    assert.equal(matches[0].content, "[name] == ring && [quality] == unique");
    assert.equal(matches[0].lineNumber, 1);
  });

  test("pattern 2: /** nip */ inline before string", () => {
    const matches = findNipStringsInJS(doc('const a = /** nip */ "[type] == armor && [quality] >= magic";'));
    assert.equal(matches.length, 1);
    assert.equal(matches[0].content, "[type] == armor && [quality] >= magic");
  });

  test("pattern 7: trailing // nip on the same line, with and without comma", () => {
    const matches = findNipStringsInJS(doc(['  "[flag] == eth", // nip', "  '[type] == ring' // NIP"].join("\n")));
    assert.equal(matches.length, 2);
    assert.equal(matches[0].content, "[flag] == eth");
    assert.equal(matches[1].content, "[type] == ring");
  });

  test("escaped quotes inside an annotated string are preserved", () => {
    const matches = findNipStringsInJS(doc('  "say \\"hi\\" [name] == x", // nip'));
    assert.equal(matches.length, 1);
    assert.equal(matches[0].content, 'say \\"hi\\" [name] == x');
  });

  test("pattern 3: @type {NipString} binds string on same or next line", () => {
    const sameLine = findNipStringsInJS(doc('/** @type {NipString} */ const a = "[name] == cap";'));
    assert.equal(sameLine.length, 1);
    assert.equal(sameLine[0].content, "[name] == cap");

    const nextLine = findNipStringsInJS(doc(["/** @type {NipString} */", 'const b = "[name] == belt";'].join("\n")));
    assert.equal(nextLine.length, 1);
    assert.equal(nextLine[0].content, "[name] == belt");
    assert.equal(nextLine[0].lineNumber, 1);
  });

  test("pattern 4: @type {NipString[]} block collects strings until block closes", () => {
    const text = [
      "/** @type {NipString[]} */",
      "const picks = [",
      '  "[name] == ring",',
      '  "[name] == amulet", // keep',
      "];",
      'const after = "[name] == notInBlock";',
    ].join("\n");
    const matches = findNipStringsInJS(doc(text));
    assert.deepEqual(
      matches.map((m) => m.content),
      ["[name] == ring", "[name] == amulet"],
    );
  });

  test("pattern 5: Record<string, NipString> skips object keys, keeps values", () => {
    const text = [
      "/** @type {Record<string, NipString>} */",
      "const named = {",
      '  "myRing": "[name] == ring && [quality] == rare",',
      "};",
    ].join("\n");
    const matches = findNipStringsInJS(doc(text));
    assert.equal(matches.length, 1);
    assert.equal(matches[0].content, "[name] == ring && [quality] == rare");
  });

  test("unannotated strings and regex-literal lines produce no matches", () => {
    const text = ['const plain = "not a nip string";', CONTROLBOT_LINE].join("\n");
    assert.equal(findNipStringsInJS(doc(text)).length, 0);
  });

  test("cache: same uri+version returns the cached array; version bump rescans", () => {
    const uri = "test://cache-check";
    const first = findNipStringsInJS(doc('"[flag] == eth", // nip', 1, uri));
    const cached = findNipStringsInJS(doc("ignored - cache should win", 1, uri));
    assert.equal(cached, first);
    const rescanned = findNipStringsInJS(doc('"[type] == ring", // nip', 2, uri));
    assert.equal(rescanned[0].content, "[type] == ring");
  });
});

describe("stripInlineCommentOutsideStrings", () => {
  test("strips a trailing comment but keeps // inside strings", () => {
    assert.equal(stripInlineCommentOutsideStrings('foo("http://x") // gone'), 'foo("http://x") ');
    assert.equal(stripInlineCommentOutsideStrings('const s = "a // b";'), 'const s = "a // b";');
  });
});
