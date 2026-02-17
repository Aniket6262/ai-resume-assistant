import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // v1.1.1 works in Node

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, "..", "public", "resume.pdf");
const outPath = path.join(__dirname, "..", "data", "resume.txt");

async function main() {
  if (!fs.existsSync(pdfPath)) {
    console.error("❌ resume.pdf not found at:", pdfPath);
    process.exit(1);
  }

  fs.mkdirSync(path.join(__dirname, "..", "data"), { recursive: true });

  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);

  const cleaned = (data.text || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  fs.writeFileSync(outPath, cleaned, "utf8");

  console.log("✅ Resume extracted to:", outPath);
  console.log("📄 Preview:", cleaned.slice(0, 200));
}

main().catch((e) => {
  console.error("❌ Extraction failed:", e);
  process.exit(1);
});
