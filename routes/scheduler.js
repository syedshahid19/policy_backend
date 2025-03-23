const express = require("express");
const router = express.Router();
const {
  scheduledMessage,
} = require("../controllers/scheduledMessageController");

router.post("/schedule-message", scheduledMessage);

module.exports = router;
