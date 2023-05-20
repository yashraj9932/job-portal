const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    required: [true, "Please add the job description"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  recruiter: {
    type: mongoose.Schema.ObjectId,
    ref: "Recruiter",
    required: true,
  },
  submissions: {
    type: [mongoose.Schema.ObjectId],
    ref: "Candidate",
    required: true,
  },
});

module.exports = mongoose.model("Job", JobSchema);
