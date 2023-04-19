const express = require("express");
const router = express.Router();

// Controllers
const { getDashboardCounts } = require("../controllers/controller.dashboard");

// Get-Dashboard-Analytics-count
router.post("/analytics/count", getDashboardCounts);

module.exports = router;
