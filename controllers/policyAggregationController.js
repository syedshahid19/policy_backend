const Policy = require("../models/policy.model");
const Category = require("../models/category.model");

exports.policyAggregation = async (req, res) => {
  try {
    const aggregation = await Policy.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$userId",
          firstname: { $first: "$userInfo.firstname" },
          email: { $first: "$userInfo.email" },
          policyCount: { $sum: 1 },
          policyNames: { $addToSet: "$categoryInfo.category_name" },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          firstname: 1,
          email: 1,
          policyCount: 1,
          policyNames: 1,
        },
      },
    ]);

    res.status(200).json(aggregation);
  } catch (err) {
    res.status(500).json({ message: "Aggregation Error", error: err.message });
  }
};
