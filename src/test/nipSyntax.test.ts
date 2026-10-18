import * as assert from "node:assert/strict";
import { describe, test } from "node:test";
import { findUnexpectedCommas } from "../nipSyntax.js";

function commasAt(line: string): number[] {
  return [...line].flatMap((ch, i) => (ch === "," ? [i] : []));
}

describe("findUnexpectedCommas", () => {
  test("accepts commas in calls to any function, not only the built-in scoring helpers", () => {
    for (const line of [
      "[type] == wand && [quality] >= normal # [itemchargedskill] == 91 # [secondarytier] == 50000 + chargeditemscore(item, 91)",
      "[name] == slayerguard # [barbarianskills] == 2 # [tier] == tierscore(item, 100000)",
      "[name] == ring # [fcr] >= 10 # [tier] == myCustomScore(item, 1, 2)",
      "[name] == ring # # [tier] == Math.max(1, 2)",
      "[name] == ring # # [tier] == $score_2(item, 1)",
    ]) {
      assert.deepEqual(findUnexpectedCommas(line), [], line);
    }
  });

  test("accepts commas in in/notin lists, with or without a space before the paren", () => {
    assert.deepEqual(findUnexpectedCommas("[name] in (wirt, greatbow)"), []);
    assert.deepEqual(findUnexpectedCommas("[quality]notin(rare,unique)"), []);
    assert.deepEqual(findUnexpectedCommas("[name] in\t(a, b)"), []);
  });

  test("a comma after an inner group or nested call still belongs to the outer call", () => {
    assert.deepEqual(findUnexpectedCommas("[tier] == tierscore(item, (1 + 2), 3)"), []);
    assert.deepEqual(findUnexpectedCommas("[tier] == tierscore(item, Math.max(1, 2), 3)"), []);
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
      assert.equal(findUnexpectedCommas(line).length, 1, line);
    }
  });

  test("flags commas after the call closes", () => {
    const line = "[name] in (a, b), [quality] == unique";
    assert.deepEqual(findUnexpectedCommas(line), [line.lastIndexOf(",")]);
  });

  test("tolerates unbalanced parentheses (reported by the paren-count check instead)", () => {
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
