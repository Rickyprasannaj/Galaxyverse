const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages
} = require("../controllers/messageController");

// send message
router.post("/send", authMiddleware, sendMessage);

// get messages between two users
router.get("/:galaxyId", authMiddleware, getMessages);

module.exports = router;