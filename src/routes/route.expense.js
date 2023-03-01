const express = require("express");
const router = express.Router();

// MiddleWares

// Controllers
const {
  createExpense,
  expenseList,
} = require("../controllers/controller.expense");

// create-Expense
router.post("/create", createExpense);
// expense-list
router.post("/list", expenseList);

module.exports = router;
