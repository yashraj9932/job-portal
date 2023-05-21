const asyncHandler = require("../middleware/async");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");
const Recruiter = require("../models/Recruiter");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

exports.getJobs = asyncHandler(async (req, res, next) => {
  let jobs;
  if (!req.params.recruiterId) {
    jobs = await Job.find();
  } else {
    jobs = await Job.find({ recruiter: req.params.recruiterId });
  }

  res.status(200).json({ success: true, count: jobs.length, data: jobs });
});

exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  res.status(200).json({ success: true, data: job });
});

exports.createJob = asyncHandler(async (req, res, next) => {
  // #swagger.tags=['Job']
  let recruiter = await Recruiter.findById(req.recruiter.id);

  //   req.body.recruiter = req.recruiter.id;
  const job = await Job.create(req.body);

  recruiter = await Recruiter.findByIdAndUpdate(
    req.recruiter.id,
    { $push: { jobs: job._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({ success: true, job, recruiter });
});

exports.deleteJob = asyncHandler(async (req, res, next) => {
  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.applyJob = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorResponse("No such job exists", 404));
  }
  let candidate = await Candidate.findById(req.body.id);
  if (!candidate) {
    return next(new ErrorResponse("No candidate", 404));
  }

  if (job.submissions.includes(req.body.id)) {
    return next(new ErrorResponse("Already Applied", 400));
  }

  candidate = await Candidate.findByIdAndUpdate(
    req.body.id,
    { $push: { jobsApplied: { job: req.params.id } } },
    {
      new: true,
      runValidators: true,
    }
  );

  job = await Job.findByIdAndUpdate(
    req.params.id,
    { $push: { submissions: req.body.id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, job, candidate });
});
