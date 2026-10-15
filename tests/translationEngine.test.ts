import test from "node:test";
import assert from "node:assert";
import { TranslationEngine } from "../lib/translationEngine";

test("TranslationEngine Unit & Integration Test Suite", async (t) => {
  await t.test("analyzeHeat detects calm/rational statements", () => {
    const result = TranslationEngine.analyzeHeat("I think we should examine the system architecture carefully.");
    assert.strictEqual(result.isConcession, false);
    assert.ok(result.heatDelta <= 15, `Expected low heat delta, got ${result.heatDelta}`);
    assert.notStrictEqual(result.emotion, "furious");
  });

  await t.test("analyzeHeat detects high aggression, ALL CAPS and exclamations", () => {
    const result = TranslationEngine.analyzeHeat("THIS IS COMPLETE NONSENSE AND RIDICULOUS! STOP LYING RIGHT NOW!");
    assert.strictEqual(result.isConcession, false);
    assert.ok(result.heatDelta >= 20, `Expected high heat delta, got ${result.heatDelta}`);
    assert.strictEqual(result.emotion, "furious");
  });

  await t.test("analyzeHeat detects Hindi concession phrase and applies cooling", () => {
    const result = TranslationEngine.analyzeHeat("theek hai maan liya, ye point valid hai");
    assert.strictEqual(result.isConcession, true);
    assert.strictEqual(result.emotion, "conceding");
    assert.ok(result.heatDelta < 0, `Expected negative heat delta (cooling), got ${result.heatDelta}`);
  });

  await t.test("analyzeHeat detects English concession phrase", () => {
    const result = TranslationEngine.analyzeHeat("fair point, you are right about the database constraints");
    assert.strictEqual(result.isConcession, true);
    assert.strictEqual(result.emotion, "conceding");
    assert.ok(result.heatDelta < 0, `Expected negative heat delta (cooling), got ${result.heatDelta}`);
  });

  await t.test("analyzeHeat detects Spanish concession phrase", () => {
    const result = TranslationEngine.analyzeHeat("tienes razon en eso, admito que fue mi error");
    assert.strictEqual(result.isConcession, true);
    assert.strictEqual(result.emotion, "conceding");
    assert.ok(result.heatDelta < 0, `Expected negative heat delta (cooling), got ${result.heatDelta}`);
  });

  await t.test("analyzeHeat detects Japanese concession phrase", () => {
    const result = TranslationEngine.analyzeHeat("確かにその通り、一理ある");
    assert.strictEqual(result.isConcession, true);
    assert.strictEqual(result.emotion, "conceding");
  });

  await t.test("translate preserves idiom and generates valid result contract", async () => {
    const res = await TranslationEngine.translate("bakwaas band karo", "hi", "en");
    assert.ok(res.translatedText, "Translated text should not be empty");
    assert.strictEqual(res.sourceLang, "hi");
    assert.strictEqual(res.targetLang, "en");
    assert.ok(typeof res.heatDelta === "number");
  });
});
