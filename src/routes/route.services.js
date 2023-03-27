const express = require("express");
const router = express.Router();

// MiddleWares

// Controllers
const {
  createServices,
  servicesList,
} = require("../controllers/controller.services");

// create-Expense
router.post("/create", createServices);
// expense-list
router.post("/list", servicesList);

module.exports = router;
