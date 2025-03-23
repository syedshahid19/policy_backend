const User = require("../models/user.model");
const Policy = require("../models/policy.model");
const Category = require("../models/category.model");
const Carrier = require("../models/carrier.model");

exports.userNameSearch = async (req, res) => {
  try {
    const { firstname } = req.query;

    if (!firstname) {
      return res.status(400).json({ message: "Username query is required" });
    }

    const user = await User.findOne({
      firstname: { $regex: new RegExp(firstname, "i") },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const policies = await Policy.find({ userId: user._id })
      .populate("categoryId")
      .populate("carrierId");

    res.status(200).json({
      user: {
        firstname: user.firstname,
        email: user.email,
      },
      policies,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
