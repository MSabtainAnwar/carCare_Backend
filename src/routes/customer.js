const express = require("express");
const router = express.Router();

// MiddleWares
const { createCustomerMiddle } = require("../middleware/customer");
// Controllers
const {
  createCustomer,
  getCustomerList,
  updateCustomerStatusById,
} = require("../controllers/customer");

// create-customer
router.post("/create", createCustomerMiddle, createCustomer);
// get-all-customer
router.post("/list", getCustomerList);
// update-customer-status
router.post("/update/status/:id", updateCustomerStatusById);

module.exports = router;
