const express = require("express");
const router = express.Router();
const {
  policyAggregation,
} = require("../controllers/policyAggregationController");

router.get("/aggregate-by-user", policyAggregation);

module.exports = router;
