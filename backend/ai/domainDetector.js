function detectDomain(text) {
  text = text.toLowerCase();

  if (text.includes("node") || text.includes("api"))
    return "Backend Developer";

  if (text.includes("react") || text.includes("frontend"))
    return "Frontend Developer";

  if (text.includes("sql") && text.includes("analysis"))
    return "Data Analyst";

  if (text.includes("react") || text.includes("javascript")) 
    return "Web Development";
  if (text.includes("Python") || text.includes("machine learning")) 
    return "Data Science";
  if (text.includes("Java") || text.includes("Backend")) 
    return "Backend";

  return "General Software";
}

module.exports = detectDomain;
