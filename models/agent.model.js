const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agent: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Agent", agentSchema);
