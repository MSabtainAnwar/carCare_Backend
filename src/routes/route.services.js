const express = require("express");
const router = express.Router();

// MiddleWares

// Controllers
const {
  createServices,
  servicesList,
  servicesListSimple,
} = require("../controllers/controller.services");

// create-Expense
router.post("/create", createServices);
// expense-list-with-pagination
router.post("/list", servicesList);
// expense-list-without-pagination
router.post("/list/simple", servicesListSimple);

module.exports = router;
