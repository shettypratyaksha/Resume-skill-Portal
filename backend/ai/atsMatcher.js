const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const ATS_KEYWORDS = [
  "javascript","node","express","mongodb","sql",
  "react","html","css","api","git","aws","docker"
];

function atsMatchScore(text= "") {
  const words = tokenizer.tokenize(text.toLowerCase());
  let matched = [];

  ATS_KEYWORDS.forEach(skill => {
    if (words.includes(skill)) matched.push(skill);
  });

  return {
    score: Math.min(100, matched.length * 10),
    matchedSkills: matched,
    missingSkills: ATS_KEYWORDS.filter(s => !matched.includes(s))
  };
}

module.exports = atsMatchScore;
