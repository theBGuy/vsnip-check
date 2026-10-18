import * as assert from "node:assert/strict";
import { describe, test } from "node:test";
import { findUnexpectedCommas } from "../nipSyntax.js";

function commasAt(line: string): number[] {
  return [...line].flatMap((ch, i) => (ch === "," ? [i] : []));
}

describe("findUnexpectedCommas", () => {
  test("accepts commas in calls to any function name", () => {
    // kolbot lowercases the line before compiling it, so these use lowercase names.
    for (const line of [
      "[type] == wand && [quality] >= normal # [itemchargedskill] == 91 # [secondarytier] == 50000 + chargeditemscore(item, 91)",
      "[name] == slayerguard # [barbarianskills] == 2 # [tier] == tierscore(item, 100000)",
      "[name] == ring # [fcr] >= 10 # [tier] == myscore(item, 1, 2)",
      "[name] == ring # # [tier] == $score_2(item, 1)",
    ]) {
      assert.deepEqual(findUnexpectedCommas(line), [], line);
    }
  });

  test("accepts any whitespace between a name and its paren", () => {
    for (const line of [
      "[name] in (wirt, greatbow)",
      "[quality]notin(rare,unique)",
      "[name] in\t(a, b)",
      "[name] in\u00a0(a, b)",
      "[tier] == tierscore\u3000(item, 1)",
    ]) {
      assert.deepEqual(findUnexpectedCommas(line), [], line);
    }
  });

  test("a comma after an inner group or nested call still belongs to the outer call", () => {
    assert.deepEqual(findUnexpectedCommas("[tier] == tierscore(item, (1 + 2), 3)"), []);
    assert.deepEqual(findUnexpectedCommas("[tier] == tierscore(item, chargeditemscore(item, 91), 3)"), []);
  });

  test("a paren left open in one section does not cover commas in the next", () => {
    const line = "[name] in (a, b # [fcr] >= 10, [mf] >= 5 # [maxquantity] == 1, [tier] == 5";
    const afterFirstSection = commasAt(line).filter((i) => i > line.indexOf("#"));
    assert.equal(afterFirstSection.length, 2);
    assert.deepEqual(findUnexpectedCommas(line), afterFirstSection);
  });

  test("flags commas outside any parentheses, at the right offsets", () => {
    const line = "[name] == ring, [quality] == unique # [fcr] >= 10, [fhr] >= 10";
    assert.deepEqual(findUnexpectedCommas(line), commasAt(line));
    assert.deepEqual(findUnexpectedCommas(",[name] == ring"), [0]);
    assert.deepEqual(findUnexpectedCommas("[name] == ring,"), [14]);
  });

  test("flags commas in parentheses that do not follow a name", () => {
    for (const line of [
      "[type] == ring # [fcr] >= 10 && ([fhr] >= 10, [mf] >= 5)",
      "[name](a, b)",
      "[tier] == 5 (a, b)",
      "[tier] == tierscore(item, (a, b))",
    ]) {
      assert.deepEqual(findUnexpectedCommas(line), [line.lastIndexOf(",")], line);
    }
  });

  test("flags commas after the call closes", () => {
    const line = "[name] in (a, b), [quality] == unique";
    assert.deepEqual(findUnexpectedCommas(line), [line.lastIndexOf(",")]);
  });

  test("an unclosed call keeps later commas in its section valid; a stray close paren is ignored", () => {
    assert.deepEqual(findUnexpectedCommas("[tier] == tierscore(item, 1"), []);
    const extraClose = "[name] == ring), a, b";
    assert.deepEqual(findUnexpectedCommas(extraClose), commasAt(extraClose));
  });

  test("empty and comma-free lines yield nothing", () => {
    assert.deepEqual(findUnexpectedCommas(""), []);
    assert.deepEqual(findUnexpectedCommas("[name] == ring # [fcr] >= 10"), []);
  });

  test("stays linear on a long adversarial line", () => {
    const line = `${"f(".repeat(50_000)}${",".repeat(50_000)}${"(,".repeat(50_000)}`;
    const start = performance.now();
    findUnexpectedCommas(line);
    assert.ok(performance.now() - start < 1000, "took longer than 1s on a 250K-char line");
  });
});
