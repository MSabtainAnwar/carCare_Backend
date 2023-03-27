const express = require("express");
const router = express.Router();

// MiddleWares

// Controllers
const { createOrder } = require("../controllers/controller.order");

// create-Order
router.post("/create", createOrder);

module.exports = router;
