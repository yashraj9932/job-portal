const Recruiter = require("../models/Recruiter");
const ErrorResponse = require("../utils/errorResponse");

const asyncHandler = require("../middleware/async");

exports.getRecruiters = asyncHandler(async (req, res, next) => {
  const recruiters = await Recruiter.find();

  res.status(200).json({
    success: true,
    count: recruiters.length,
    msg: recruiters,
  });
});

exports.addRecruiter = asyncHandler(async (req, res, next) => {
  const recruiter = await Recruiter.create(req.body);

  res.status(201).json({
    success: true,
    msg: recruiter,
  });
});

exports.getRecruiter = asyncHandler(async (req, res, next) => {
  const recruiter = await Recruiter.findById(req.params.id);

  if (!recruiter) {
    return next(
      new ErrorResponse(
        `Recruiter not found with the id of ${req.params.id}`,
        405
      )
    );
  }

  res.status(200).json({
    success: true,
    msg: recruiter,
  });
});

exports.updateRecruiter = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {};

  if (req.body.name) {
    fieldsToUpdate.name = req.body.name;
  }
  if (req.body.email) {
    fieldsToUpdate.email = req.body.email;
  }

  const recruiter = await Recruiter.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    success: true,
    msg: recruiter,
  });
});

exports.deleteRecruiter = asyncHandler(async (req, res, next) => {
  await Recruiter.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.recruiterLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 404));
  }
  //Check for user
  const recruiter = await Recruiter.findOne({ email }).select("+password");

  if (!recruiter) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  //Check is password matches
  const isMatch = recruiter.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  sendTokenResponse(recruiter, 200, res);
});

const sendTokenResponse = (recruiter, statusCode, res) => {
  //Create token
  const token = recruiter.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
