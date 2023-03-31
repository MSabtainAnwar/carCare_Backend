const express = require("express");
const router = express.Router();

// MiddleWares
const {
  createOrderMiddle,
  getRemindMiddle,
} = require("../middleware/middleware.order");
// Controllers
const {
  createOrder,
  getOrderListByCustomerId,
  getAllReminderOrder,
  goToRemindCustomer,
} = require("../controllers/controller.order");

// create-Order
router.post("/create", createOrderMiddle, createOrder);
// order-list-by-customer-list
router.post("/list/customer", getOrderListByCustomerId);
// Reminder-orders-list
router.post("/reminder/list", getRemindMiddle, getAllReminderOrder);
// Reminded-Order
router.post("/reminded", goToRemindCustomer);


module.exports = router;
