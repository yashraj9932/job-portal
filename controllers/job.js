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

// exports.updateQ = asyncHandler(async (req, res, next) => {
//   // #swagger.tags=['Job']

//   let job = await Job.findById(req.params.id);
//   if (!job) {
//     return next(new ErrorResponse("Job does not exist", 404));
//   }
//   const fieldsToUpdate = {
//     title: req.body.title,
//     details: req.body.details,
//   };
//   job = await Job.findByIdAndUpdate(
//     req.params.id,
//     fieldsToUpdate,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(201).json({ success: true, msg: job });
// });

// exports.updateA = asyncHandler(async (req, res, next) => {
//   // #swagger.tags=['Job']

//   let job = await Job.findById(req.params.id);
//   if (!job) {
//     return next(new ErrorResponse("Job does not exist", 404));
//   }

//   if (!req.files) {
//     return next(new ErrorResponse(`Please upload a file`, 400));
//   }

//   const file = req.files.file;

//   // Make sure the image is a pdf or docx
//   if (!file.mimetype.startsWith("application")) {
//     return next(new ErrorResponse(`Please upload file in correct format`, 400));
//   }

//   const candidate = await Candidate.findById(req.candidate.id);
//   const assleft = candidate.jobsLeft;
//   if (assleft.indexOf(req.params.id) === -1) {
//     return next(
//       new ErrorResponse("Job has already been submitted", 400)
//     );
//   } else {
//     const leftt = req.params.id;

//     const ress = await Candidate.updateMany(
//       { role: "candidate" },
//       { $pull: { jobsLeft: leftt } }
//     );
//   }

//   // Create custom filename
//   file.name = `pdf_${req.candidate.id}${path.parse(file.name).ext}`;

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
//     if (err) {
//       console.error(err);
//       return next(new ErrorResponse(`Problem with file upload`, 500));
//     }
//     let val = job.jobSubmitted;

//     const valls = {
//       candidate: req.candidate.id,
//       answerpdf: file.name,
//     };
//     val.push(valls);

//     const fieldsToUpdate = {
//       jobSubmitted: val,
//     };
//     job = await Job.findByIdAndUpdate(
//       req.params.id,
//       fieldsToUpdate,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     res.status(200).json({
//       success: true,
//       data: file.name,
//       job,
//     });
//   });
// });
