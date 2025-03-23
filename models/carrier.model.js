const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
});

module.exports = mongoose.model("Carrier", carrierSchema);
