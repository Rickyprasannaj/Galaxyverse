const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getGels,
  getSignals
} = require("../controllers/friendController");

router.post("/send", auth, sendRequest);
router.post("/accept", auth, acceptRequest);
router.get("/reject", auth, rejectRequest);
router.get("/list", auth, getGels);
router.get("/signals", auth, getSignals);


module.exports = router;
