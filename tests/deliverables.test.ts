import test from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";

test("Deliverables Verification Test Suite", async (t) => {
  const deliverablesPath = path.join(__dirname, "..", "ASSIGNMENT_DELIVERABLES.md");

  await t.test("ASSIGNMENT_DELIVERABLES.md exists in repository root", () => {
    assert.strictEqual(fs.existsSync(deliverablesPath), true);
  });

  const content = fs.readFileSync(deliverablesPath, "utf-8");

  await t.test("The Middle Market paragraph is under 150 words", () => {
    const match = content.match(/### 1\. The Middle Market\s+([\s\S]*?)(?=\*Word count:\*)/);
    assert.ok(match, "The Middle Market section not found");
    const words = match[1].trim().split(/\s+/).filter(Boolean).length;
    assert.ok(words > 50, `Word count too short: ${words}`);
    assert.ok(words < 150, `Word count exceeds 150 words: ${words}`);
  });

  await t.test("CLOSURE paragraph is under 150 words", () => {
    const match = content.match(/### 2\. CLOSURE\s+([\s\S]*?)(?=\*Word count:\*)/);
    assert.ok(match, "CLOSURE section not found");
    const words = match[1].trim().split(/\s+/).filter(Boolean).length;
    assert.ok(words > 50, `Word count too short: ${words}`);
    assert.ok(words < 150, `Word count exceeds 150 words: ${words}`);
  });

  await t.test("ISHQweds paragraph is under 150 words", () => {
    const match = content.match(/### 3\. ISHQweds\s+([\s\S]*?)(?=\*Word count:\*)/);
    assert.ok(match, "ISHQweds section not found");
    const words = match[1].trim().split(/\s+/).filter(Boolean).length;
    assert.ok(words > 50, `Word count too short: ${words}`);
    assert.ok(words < 150, `Word count exceeds 150 words: ${words}`);
  });

  await t.test("Official links and interview token are verified", () => {
    assert.ok(content.includes("https://takraar-engine.vercel.app"), "Live Vercel link missing");
    assert.ok(content.includes("https://github.com/Vaibhavsahkk/Takraar-engine.git"), "GitHub repo link missing");
    assert.ok(content.includes("e4fc6d4bf4e0c9ad29fa07800eff312c"), "Interview submission token missing");
  });
});
