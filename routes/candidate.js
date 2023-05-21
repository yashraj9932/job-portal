const express = require("express");

const router = express.Router();

const {
  getCandidates,
  addCandidate,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  candidateLogin,
  addCandidateResume,
} = require("../controllers/candidate");

router.route("/").get(getCandidates).post(addCandidate);

router
  .route("/:id")
  .get(getCandidate)
  .put(updateCandidate)
  .delete(deleteCandidate);

router.route("/addresume/:id").post(addCandidateResume);
router.route("/login").post(candidateLogin);

module.exports = router;
