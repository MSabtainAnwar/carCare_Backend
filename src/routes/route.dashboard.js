const express = require("express");
const router = express.Router();

// Controllers
const {
  getDashboardCounts,
  getSalesAndExpenseChart,
} = require("../controllers/controller.dashboard");

// Get-Dashboard-Analytics-count
router.post("/analytics/count", getDashboardCounts);

// graph-for-sales-and-expense
router.post("/graph/salesAndexpense", getSalesAndExpenseChart);

module.exports = router;
