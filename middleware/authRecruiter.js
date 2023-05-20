const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const Recruiter = require("../models/Recruiter");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  //   // Set token from cookie
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded.id);
    req.recruiter = await Recruiter.findById(decoded.id);
    // console.log(req.recruiter);

    next();
  } catch (err) {
    return next(
      new ErrorResponse("Not authorized to access this route,wrong token", 401)
    );
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.recruiter.role)) {
      return next(
        new ErrorResponse(`User Role ${req.recruiter.role} not authorised`),
        403
      );
    }
    next();
  };
};
