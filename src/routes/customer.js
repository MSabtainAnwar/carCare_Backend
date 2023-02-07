const express = require("express");
const router = express.Router();

// MiddleWares
const { createCustomerMiddle } = require("../middleware/customer");
// Controllers
const { createCustomer, getCustomerList } = require("../controllers/customer");

// create-customer
router.post("/create", createCustomerMiddle, createCustomer);
// get-all-customer
router.post("/list", getCustomerList);

module.exports = router;
