const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  policy_number: { type: String, required: true },
  policy_start_date: { type: Date, required: true },
  policy_end_date: { type: Date, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  carrierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carrier",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Policy", policySchema);
