const express = require("express");

const router = express.Router();

const {
  getRecruiters,
  addRecruiter,
  getRecruiter,
  updateRecruiter,
  deleteRecruiter,
  recruiterLogin,
} = require("../controllers/recruiter");

// const assignmentRouter = require("./assigment");

// router.use("/:recruiterid/assignment", assignmentRouter);

router.route("/").get(getRecruiters).post(addRecruiter);

router
  .route("/:id")
  .get(getRecruiter)
  .put(updateRecruiter)
  .delete(deleteRecruiter);

router.route("/login").post(recruiterLogin);

module.exports = router;
