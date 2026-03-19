const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: { type: [String], required: true },
  certifications: [String],
  experience: { type: Number, required: true },
  resumePath: String,
  skillScore: { type: Number, default: 0 } // computed score
});

// Indexes for optimized search
userSchema.index({ name: 1 });
userSchema.index({ skills: 1 });

module.exports = mongoose.model("User", userSchema);
