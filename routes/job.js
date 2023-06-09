const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  createJob,
  getJob,
  getJobs,
  deleteJob,
  applyJob,
} = require("../controllers/job");

const { protect, authorize } = require("../middleware/authRecruiter");
// const { protect1, authorize1 } = require("../middleware/authS");

router.route("/").get(getJobs).post(protect, createJob);

router.route("/:id").get(getJob).delete(protect, deleteJob);

router.route("/apply/:id").post(applyJob);

module.exports = router;
