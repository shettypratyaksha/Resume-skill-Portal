const fs = require("fs");
const pdfParse = require("pdf-parse");
const { spawn } = require("child_process");

// -------- PDF TEXT EXTRACTION --------
async function extractTextFromPDF(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    console.error("PDF PARSE ERROR:", err.message);
    return "";
  }
}

// -------- ASK OLLAMA (STABLE & SIMPLE) --------
function askOllama(prompt) {
  return new Promise((resolve) => {
    const ollama = spawn("ollama", ["run", "qwen2.5:0.5b"]);

    let output = "";

    ollama.stdout.on("data", (data) => {
      output += data.toString();
    });

    ollama.on("close", () => {
      resolve(output.trim());
    });

    ollama.stdin.write(prompt);
    ollama.stdin.end();
  });
}

module.exports = { extractTextFromPDF, askOllama };
