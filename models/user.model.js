const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
    required: true,
  },
  userType: { type: String, required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
});

module.exports = mongoose.model("User", userSchema);
