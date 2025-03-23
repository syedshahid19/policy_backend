const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  account_name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
});

module.exports = mongoose.model("Account", accountSchema);
