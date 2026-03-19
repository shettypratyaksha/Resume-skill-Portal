
// ================= DEPENDENCIES =================
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require("./models/user");
const Login = require("./models/Login");

const atsMatchScore = require("./ai/atsMatcher");
const detectDomain = require("./ai/domainDetector");

const { extractTextFromPDF, askOllama } = require("./aiUtils");

let LAST_RESUME_TEXT = "";

// ================= EXPRESS APP =================
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ================= ROUTES =================

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ---------------- UPLOAD RESUME ----------------
app.post("/uploadResume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractTextFromPDF(req.file.path);
    LAST_RESUME_TEXT = text;

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({ text });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    res.status(500).json({ error: "Failed to extract resume text" });
  }
});

// ---------------- AI PREDEFINED (KEEP OLD BEHAVIOR) ----------------
app.post("/ai/predefined", async (req, res) => {
  try {
    const resumeText = req.body.resumeText || LAST_RESUME_TEXT;

    if (!resumeText || resumeText.trim().length < 30) {
      return res.json({});
    }

    const prompt = `
You are a resume reviewer.

Give human-like feedback similar to a placement officer.

Resume:
${resumeText}
`;







    const aiResponse = await askOllama(prompt);

    res.json({
      keySkills: atsMatchScore(resumeText).matchedSkills,
      missingSkills: [],
      skillRating: "N/A",
      formatProfessional:
        "The resume maintains a professional format, with clear sections for education and skills. The student's GPA is notably high.",
      formatSuggestions:
        "Include specific projects or coursework examples to better demonstrate proficiency in web development, software development, and database systems.",
      appealSuggestions:
        "Highlight a willingness to learn new technologies as this shows adaptability. Emphasize communication skills that relate directly to project work where collaboration is key.",
      strengths: [
        "Quick learner",
        "Strong coding interest",
        "Good communication and teamwork skill",
      ],
      weaknesses: [],
      // overallFeedback:
      //   "The resume showcases a strong academic background, particularly in web development and software programming languages. The student's willingness to learn new technologies is appealing for future projects that require adaptability.",
      overallFeedback: aiResponse

    });
  } catch (err) {
    console.error("AI PREDEFINED ERROR:", err.message);
    res.json({});
  }
});

// ---------------- ASK AI (GENERIC CHAT – NOT RESUME DEPENDENT) ----------------
app.post("/ai/custom", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.json({ answer: "Please ask a question." });
    }

    const prompt = `
You are an AI assistant.
Answer the user's question clearly and helpfully.

Question:
${question}
`;

    const answer = await askOllama(prompt);
    res.json({ answer });
  } catch (err) {
    console.error("AI CUSTOM ERROR:", err.message);
    res.json({ answer: "AI failed to respond" });
  }
});

// ---------------- ANALYZE RESUME (ATS + DOMAIN ONLY) ----------------
app.post("/analyze-resume", upload.single("analyzeResume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No resume uploaded" });

    const text = await extractTextFromPDF(req.file.path);

    const ats = atsMatchScore(text);
    const domain = detectDomain(text);

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({
      domain,
      atsScore: ats.score,
      matchedSkills: ats.matchedSkills,
      missingSkills: ats.missingSkills,
      aiSuggestions: "AI suggestions shown above",
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err.message);
    res.status(500).json({ error: "Resume analysis failed" });
  }
});

// ---------------- USERS database ----------------
app.post("/users", upload.single("analyzeResume"), async (req, res) => {
  try {
    const skills = req.body.skills ? req.body.skills.split(",").map(s => s.trim()) : [];
    const certs = req.body.certifications ? req.body.certifications.split(",").map(c => c.trim()) : [];
    const experience = Number(req.body.experience || 0);

    const skillScore = skills.length * 5 + certs.length * 2 + experience * 2;



    const user = new User({
      name: req.body.name,
      skills,
      certifications: certs,
      experience,
      resumePath: req.file ? req.file.path : "",
      skillScore,
    });

    await user.save();


    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//fetching users
app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//fetching
app.get("/search", async (req, res) => {
  const users = await User.find({ skills: req.query.skill });
  res.json(users);
});

// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.save();
    res.json({ message: "Login saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
const PORT = 9000;
mongoose
  .connect("mongodb://127.0.0.1:27017/resumeSkillPortal")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error(err.message));
