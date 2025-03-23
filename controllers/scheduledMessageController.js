const schedule = require("node-schedule");
const ScheduledMessage = require("../models/scheduledMessage.model");

exports.scheduledMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;

    // Check if inputs are provided
    if (!message || !day || !time) {
      return res
        .status(400)
        .json({ message: "Message, day, and time are required" });
    }

    // Convert to Date object
    const [hour, minute] = time.split(":").map(Number);
    const targetDate = new Date(day);
    targetDate.setHours(hour);
    targetDate.setMinutes(minute);
    targetDate.setSeconds(0);

    // Validate future date
    if (targetDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Scheduled time must be in the future" });
    }

    // Schedule job
    const job = schedule.scheduleJob(targetDate, async () => {
      await ScheduledMessage.create({ message, scheduledFor: targetDate });
      console.log(`Message saved at scheduled time: ${message}`);
    });

    // Response
    res.status(200).json({
      message: "Message scheduled successfully",
      scheduledFor: targetDate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error scheduling message", error: error.message });
  }
};
