const fs = require("fs");
const pdf = require("pdf-parse");

// async function extractText(pdfPath) {
//   const dataBuffer = fs.readFileSync(pdfPath);
//   const data = await pdf(dataBuffer);
//   return data.text;
// }

// module.exports = extractText;

// const fs = require("fs");
// const pdf = require("pdf-parse");

module.exports = async function extractText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text || "";
};
