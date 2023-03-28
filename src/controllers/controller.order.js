const Order = require("../models/model.order");
const responseStatus = require("../helpers/status");

// Create-Order
const createOrder = async (req, res) => {
  try {
    const createOrder = await new Order(req.body).save();
    res.status(201).json(responseStatus(true, "created", "Order", createOrder));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// get-order-list
const getOrderListByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.body;
    const getList = await Order.find({ customerId })?.populate(
      "customerId vehicleId servicesId productId"
    );
    res.status(200).json(responseStatus(true, "ok", "Success", getList));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// get-all-reminder-order
const getAllReminderOrder = async (req, res) => {
  try {
    const { remindDate } = req.body;
    const findOrder = await Order.find({
      createdAt: { $lte: remindDate },
      remindOnOrder: true,
    });
    console.log(findOrder);
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createOrder, getOrderListByCustomerId, getAllReminderOrder };
