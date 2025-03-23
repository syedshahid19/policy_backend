const express = require("express");
const router = express.Router();
const { userNameSearch } = require("../controllers/userNameSearchController");

router.get("/search", userNameSearch);

module.exports = router;
