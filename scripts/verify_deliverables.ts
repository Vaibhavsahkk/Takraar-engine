import fs from "fs";
import path from "path";

const deliverablesPath = path.join(__dirname, "..", "ASSIGNMENT_DELIVERABLES.md");

if (!fs.existsSync(deliverablesPath)) {
  console.error("FAIL: ASSIGNMENT_DELIVERABLES.md does not exist in repository!");
  process.exit(1);
}

const content = fs.readFileSync(deliverablesPath, "utf-8");

// Extract the 3 paragraphs
const mmMatch = content.match(/### 1\. The Middle Market\s+([\s\S]*?)(?=\*Word count:\*)/);
const clMatch = content.match(/### 2\. CLOSURE\s+([\s\S]*?)(?=\*Word count:\*)/);
const iwMatch = content.match(/### 3\. ISHQweds\s+([\s\S]*?)(?=\*Word count:\*)/);

if (!mmMatch || !clMatch || !iwMatch) {
  console.error("FAIL: Could not extract all three product sections from ASSIGNMENT_DELIVERABLES.md");
  process.exit(1);
}

function countWords(str: string) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const mmWords = countWords(mmMatch[1]);
const clWords = countWords(clMatch[1]);
const iwWords = countWords(iwMatch[1]);

console.log(`The Middle Market: ${mmWords} words (Limit: < 150)`);
console.log(`CLOSURE: ${clWords} words (Limit: < 150)`);
console.log(`ISHQweds: ${iwWords} words (Limit: < 150)`);

if (mmWords >= 150 || clWords >= 150 || iwWords >= 150) {
  console.error("FAIL: One or more paragraphs exceed the 150-word strict limit!");
  process.exit(1);
}

// Verify links exist
const hasLiveUrl = content.includes("https://takraar-engine.vercel.app");
const hasRepoUrl = content.includes("https://github.com/Vaibhavsahkk/Takraar-engine.git");
const hasToken = content.includes("e4fc6d4bf4e0c9ad29fa07800eff312c");

if (!hasLiveUrl || !hasRepoUrl || !hasToken) {
  console.error("FAIL: Deliverables file is missing live URL, repo URL, or submission token!");
  process.exit(1);
}

console.log("PASS: All 3 deliverables and URLs verified successfully!");
