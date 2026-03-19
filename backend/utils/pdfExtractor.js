const fs = require("fs");
const pdfParse = require("pdf-parse");

async function extractText(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    console.error("PDF EXTRACT ERROR:", err.message);
    return "";
  }
}

module.exports = extractText;
