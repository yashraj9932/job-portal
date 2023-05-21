const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  jobsApplied: {
    type: [
      {
        job: {
          type: mongoose.Schema.ObjectId,
          ref: "Job",
        },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  resume: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
});

// Encrypt password using bcrypt
CandidateSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
CandidateSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
CandidateSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(enteredPassword, this.password);

  return bcrypt.compare(enteredPassword, this.password, () => {
    try {
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = mongoose.model("Candidate", CandidateSchema);
