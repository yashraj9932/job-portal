const Candidate = require("../models/Candidate");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

const asyncHandler = require("../middleware/async");

//@desc    Get All Candidates
//@route   GET /candidate
//@Acess   Private/Admin

exports.getCandidates = asyncHandler(async (req, res, next) => {
  const candidates = await Candidate.find();
  // #swagger.tags=['Candidate']

  res.status(200).json({
    success: true,
    count: candidates.length,
    msg: candidates,
  });
});

//@desc    Add new Candidate
//@route   POST /candidate
//@Acess   Private/Admin

exports.addCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.create(req.body);

  // #swagger.tags=['Candidate']

  res.status(201).json({
    success: true,
    msg: candidate,
  });
});

//@desc    Get a Single Candidate
//@route   GET /candidate/:id
//@Acess   Private/Admin

exports.getCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  // #swagger.tags=['Candidate']

  if (!candidate) {
    return next(
      newErrorResponse(
        `Candidate not found with the id of ${req.params.id}`,
        405
      )
    );
  }

  res.status(200).json({
    success: true,
    msg: candidate,
  });
});

//@desc    Add new Candidate
//@route   PUT /candidate
//@Acess   Private/Admin

exports.updateCandidate = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {};
  if (req.body.name) {
    fieldsToUpdate.name = req.body.name;
  }
  if (req.body.email) {
    fieldsToUpdate.email = req.body.email;
  }
  // #swagger.tags=['Candidate']

  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    success: true,
    msg: candidate,
  });
});

// @desc      Delete Candidate
// @route     DELETE /Candidate/:id
// @access    Private/Admin
exports.deleteCandidate = asyncHandler(async (req, res, next) => {
  await Candidate.findByIdAndDelete(req.params.id);
  // #swagger.tags=['Candidate']

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc   Login User
//@route  POST /candidate/login
//@Acess Public

exports.candidateLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 404));
  }

  //Check for user
  const candidate = await Candidate.findOne({ email }).select("+password");

  if (!candidate) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  //Check is password matches
  const isMatch = candidate.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  sendTokenResponse(candidate, 200, res);
});

exports.addCandidateResume = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  // Make sure the image is a pdf or docx
  if (!file.mimetype.startsWith("application")) {
    return next(new ErrorResponse(`Please upload file in correct format`, 400));
  }

  // Create custom filename
  file.name = `pdf_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      {
        resume: file.name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      candidate,
    });
  });
});

const sendTokenResponse = (candidate, statusCode, res) => {
  //Create token
  const token = candidate.getSignedJwtToken();

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
