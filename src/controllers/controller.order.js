const Order = require("../models/model.order");
const responseStatus = require("../helpers/status");

// Create-Services
const createOrder = async (req, res) => {
  try {
    const createOrder = await new Order(req.body).save();
    res.status(201).json(responseStatus(true, "created", "Order", createOrder));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createOrder };
