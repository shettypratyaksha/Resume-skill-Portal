// const OpenAI = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function getAISuggestions(resumeText, domain) {
//   const prompt = `
// You are an ATS resume expert.
// Resume Domain: ${domain}
// Resume Content:
// ${resumeText}

// Give suggestions under:
// 1. Format
// 2. Skills to learn
// 3. Style improvements
// 4. Content improvements
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }]
//   });

//   return response.choices[0].message.content;
// }

// module.exports = getAISuggestions;





let openai = null;

// if (process.env.OPENAI_API_KEY) {
//   const OpenAI = require("openai");
//   openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
//   });
// }

if (!process.env.OPENAI_API_KEY) {
  module.exports = async () => "AI disabled (no API key)";
  return;
}


