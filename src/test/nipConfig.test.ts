import * as assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { after, describe, test } from "node:test";
import {
  CONFIG_FILE_NAME,
  type LoadedConfigFile,
  NipConfigResolver,
  parseConfigText,
  readConfigFileSync,
} from "../nipConfig.js";

describe("parseConfigText", () => {
  test("normalizes entries like the settings path (trim, lowercase, drop empty)", () => {
    const { additions, problems } = parseConfigText(
      JSON.stringify({ additionalStats: [" MyStat ", "", "other"], additionalExtras: ["Tier2"] }),
    );
    assert.deepEqual(problems, []);
    assert.deepEqual(additions, {
      additionalProperties: [],
      additionalStats: ["mystat", "other"],
      additionalExtras: ["tier2"],
    });
  });

  test("$schema is accepted without a problem", () => {
    const { problems } = parseConfigText('{ "$schema": "./x.json", "additionalStats": [] }');
    assert.deepEqual(problems, []);
  });

  test("a UTF-8 BOM does not break parsing", () => {
    const { additions, problems } = parseConfigText(`${String.fromCharCode(0xfeff)}{"additionalStats":["a"]}`);
    assert.deepEqual(problems, []);
    assert.deepEqual(additions.additionalStats, ["a"]);
  });

  test("an empty or whitespace-only file is an empty config, not an error", () => {
    for (const text of ["", "  \r\n\t"]) {
      const { additions, problems } = parseConfigText(text);
      assert.deepEqual(problems, []);
      assert.deepEqual(additions.additionalStats, []);
    }
  });

  test("invalid JSON yields one problem and no additions", () => {
    const { additions, problems } = parseConfigText('{ "additionalStats": ["a", }');
    assert.equal(problems.length, 1);
    assert.match(problems[0].message, /^Invalid JSON, so this file is ignored: /);
    assert.deepEqual([problems[0].line, problems[0].character], [0, 0]);
    assert.deepEqual(additions.additionalStats, []);
  });

  test("a non-object top level is rejected whole", () => {
    for (const text of ["[]", "null", '"additionalStats"', "42"]) {
      const { problems } = parseConfigText(text);
      assert.equal(problems.length, 1, text);
      assert.match(problems[0].message, /top level/);
    }
  });

  test("a mistyped key is skipped and pointed at; sibling keys still apply", () => {
    const text = '{\r\n  "additionalStats": "mystat",\r\n  "additionalExtras": ["x"]\r\n}';
    const { additions, problems } = parseConfigText(text);
    assert.equal(problems.length, 1);
    assert.match(problems[0].message, /"additionalStats" must be an array of strings/);
    assert.deepEqual([problems[0].line, problems[0].character, problems[0].length], [1, 2, 17]);
    assert.deepEqual(additions.additionalStats, []);
    assert.deepEqual(additions.additionalExtras, ["x"]);
  });

  test("non-string entries are reported but the strings are kept", () => {
    const { additions, problems } = parseConfigText('{"additionalStats": ["a", 1, null, "b"]}');
    assert.equal(problems.length, 1);
    assert.match(problems[0].message, /non-string entries/);
    assert.deepEqual(additions.additionalStats, ["a", "b"]);
  });

  test("an unknown key (e.g. a typo) is reported at the key", () => {
    const text = '{\n  "additionalStats": ["a"],\n    "additionalStat": ["b"]\n}';
    const { additions, problems } = parseConfigText(text);
    assert.equal(problems.length, 1);
    assert.match(problems[0].message, /^Unknown key "additionalStat" is ignored/);
    assert.deepEqual([problems[0].line, problems[0].character], [2, 4]);
    assert.deepEqual(additions.additionalStats, ["a"]);
  });

  test("root is read as a boolean and defaults to false", () => {
    assert.equal(parseConfigText('{"root": true}').root, true);
    assert.equal(parseConfigText('{"root": false}').root, false);
    assert.equal(parseConfigText('{"additionalStats": []}').root, false);
    assert.equal(parseConfigText("").root, false);
    assert.deepEqual(parseConfigText('{"root": true}').problems, []);
  });

  test("a non-boolean root is reported and treated as false", () => {
    for (const value of ['"true"', "1", "null"]) {
      const { root, problems } = parseConfigText(`{"root": ${value}}`);
      assert.equal(root, false, value);
      assert.equal(problems.length, 1, value);
      assert.match(problems[0].message, /^"root" must be true or false/);
    }
  });

  test("an unparseable file never declares root", () => {
    assert.equal(parseConfigText('{"root": true,').root, false);
    assert.equal(parseConfigText("[true]").root, false);
  });
});

describe("NipConfigResolver", () => {
  const ROOT = resolve("/");
  const WS = join(ROOT, "ws");
  const PICKIT = join(WS, "pickit");
  const SUB = join(PICKIT, "sub");

  function fakeFs(files: Record<string, unknown>) {
    const reads: string[] = [];
    const contents = new Map(Object.entries(files).map(([dir, cfg]) => [join(dir, CONFIG_FILE_NAME), cfg]));
    const read = (path: string) => {
      reads.push(path);
      const cfg = contents.get(path);
      return cfg === undefined ? undefined : typeof cfg === "string" ? cfg : JSON.stringify(cfg);
    };
    return { read, reads };
  }

  const statsOf = (files: LoadedConfigFile[]) => files.map((f) => f.additions.additionalStats);

  test("collects every file from the stop dir down, outermost first", () => {
    const { read } = fakeFs({
      [WS]: { additionalStats: ["ws"] },
      [PICKIT]: { additionalStats: ["pickit"] },
      [SUB]: { additionalStats: ["sub"] },
    });
    const files = new NipConfigResolver({ read }).filesFor(SUB, WS);
    assert.deepEqual(statsOf(files), [["ws"], ["pickit"], ["sub"]]);
    assert.deepEqual(
      files.map((f) => f.path),
      [WS, PICKIT, SUB].map((dir) => join(dir, CONFIG_FILE_NAME)),
    );
  });

  test("a sibling folder does not see a nested folder's file", () => {
    const { read } = fakeFs({ [PICKIT]: { additionalStats: ["pickit"] }, [SUB]: { additionalStats: ["sub"] } });
    const files = new NipConfigResolver({ read }).filesFor(join(PICKIT, "other"), WS);
    assert.deepEqual(statsOf(files), [["pickit"]]);
  });

  test("the walk stops at the stop dir; without one it reaches the filesystem root", () => {
    const { read } = fakeFs({ [ROOT]: { additionalStats: ["root"] }, [PICKIT]: { additionalStats: ["pickit"] } });
    assert.deepEqual(statsOf(new NipConfigResolver({ read }).filesFor(SUB, WS)), [["pickit"]]);
    assert.deepEqual(statsOf(new NipConfigResolver({ read }).filesFor(SUB)), [["root"], ["pickit"]]);
  });

  test("a document directly in the stop dir reads only that dir", () => {
    const { read, reads } = fakeFs({ [WS]: { additionalStats: ["ws"] } });
    assert.deepEqual(statsOf(new NipConfigResolver({ read }).filesFor(WS, WS)), [["ws"]]);
    assert.deepEqual(reads, [join(WS, CONFIG_FILE_NAME)]);
  });

  test("hits and misses are both cached until clear()", () => {
    const { read, reads } = fakeFs({ [PICKIT]: { additionalStats: ["pickit"] } });
    const resolver = new NipConfigResolver({ read });
    resolver.filesFor(SUB, WS);
    assert.equal(reads.length, 3); // sub (absent), pickit, ws (absent)

    resolver.filesFor(SUB, WS);
    resolver.filesFor(join(PICKIT, "other"), WS);
    assert.equal(reads.length, 4, "only the new sibling dir is read; shared parents come from cache");

    resolver.clear();
    resolver.filesFor(SUB, WS);
    assert.equal(reads.length, 7);
  });

  test("onLoad fires once per parsed file, never for absent dirs or cache hits", () => {
    const { read } = fakeFs({ [PICKIT]: '{"additionalStat": []}' });
    const loaded: LoadedConfigFile[] = [];
    const resolver = new NipConfigResolver({ read, onLoad: (file) => loaded.push(file) });
    resolver.filesFor(SUB, WS);
    resolver.filesFor(SUB, WS);
    resolver.load(PICKIT);
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].path, join(PICKIT, CONFIG_FILE_NAME));
    assert.match(loaded[0].problems[0].message, /Unknown key "additionalStat"/);
  });

  test("a root file stops the walk: parents are neither applied nor read", () => {
    const { read, reads } = fakeFs({
      [WS]: { additionalStats: ["ws"] },
      [PICKIT]: { root: true, additionalStats: ["pickit"] },
      [SUB]: { additionalStats: ["sub"] },
    });
    const files = new NipConfigResolver({ read }).filesFor(SUB, WS);
    assert.deepEqual(statsOf(files), [["pickit"], ["sub"]]);
    assert.ok(!reads.includes(join(WS, CONFIG_FILE_NAME)));
  });

  test("a root file in the document's own folder leaves only that file", () => {
    const { read } = fakeFs({ [PICKIT]: { additionalStats: ["pickit"] }, [SUB]: { root: true } });
    assert.deepEqual(statsOf(new NipConfigResolver({ read }).filesFor(SUB, WS)), [[]]);
  });

  test("root only cuts off its own subtree; a sibling still inherits", () => {
    const { read } = fakeFs({ [PICKIT]: { additionalStats: ["pickit"] }, [SUB]: { root: true } });
    const resolver = new NipConfigResolver({ read });
    resolver.filesFor(SUB, WS);
    assert.deepEqual(statsOf(resolver.filesFor(join(PICKIT, "other"), WS)), [["pickit"]]);
  });

  test("a broken or mistyped root file does not stop the walk", () => {
    for (const sub of ['{"root": true,', '{"root": "yes"}']) {
      const { read } = fakeFs({ [PICKIT]: { additionalStats: ["pickit"] }, [SUB]: sub });
      const files = new NipConfigResolver({ read }).filesFor(SUB, WS);
      assert.deepEqual(statsOf(files), [["pickit"], []], sub);
    }
  });

  test("a read failure other than 'absent' becomes a problem on that file", () => {
    const read = (path: string) => {
      if (path === join(PICKIT, CONFIG_FILE_NAME)) throw new Error("EACCES: permission denied");
      return undefined;
    };
    const files = new NipConfigResolver({ read }).filesFor(SUB, WS);
    assert.equal(files.length, 1);
    assert.match(files[0].problems[0].message, /^Could not read this file, so it is ignored: EACCES/);
    assert.deepEqual(files[0].additions.additionalStats, []);
  });

  test("the stop dir matches case-insensitively on win32", { skip: process.platform !== "win32" }, () => {
    const { read } = fakeFs({ [ROOT]: { additionalStats: ["root"] }, [PICKIT]: { additionalStats: ["pickit"] } });
    const files = new NipConfigResolver({ read }).filesFor(SUB, WS.toUpperCase());
    assert.deepEqual(statsOf(files), [["pickit"]]);
  });
});

describe("readConfigFileSync", () => {
  const dir = mkdtempSync(join(tmpdir(), "vsnip-config-"));
  after(() => rmSync(dir, { recursive: true, force: true }));

  test("returns undefined for a missing file", () => {
    assert.equal(readConfigFileSync(join(dir, CONFIG_FILE_NAME)), undefined);
  });

  test("returns undefined when the config path is a directory", () => {
    const asDir = join(dir, "dir-case");
    mkdirSync(join(asDir, CONFIG_FILE_NAME), { recursive: true });
    assert.equal(readConfigFileSync(join(asDir, CONFIG_FILE_NAME)), undefined);
  });

  test("returns undefined when a path segment is a file", () => {
    writeFileSync(join(dir, "plain.txt"), "x");
    assert.equal(readConfigFileSync(join(dir, "plain.txt", CONFIG_FILE_NAME)), undefined);
  });

  test("reads a real file end to end, BOM included", () => {
    const withFile = join(dir, "file-case");
    mkdirSync(withFile);
    writeFileSync(join(withFile, CONFIG_FILE_NAME), `${String.fromCharCode(0xfeff)}{"additionalExtras":["E"]}`);
    const files = new NipConfigResolver().filesFor(withFile, withFile);
    assert.equal(files.length, 1);
    assert.deepEqual(files[0].problems, []);
    assert.deepEqual(files[0].additions.additionalExtras, ["e"]);
  });
});
