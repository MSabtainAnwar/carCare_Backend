const Order = require("../models/model.order");
const responseStatus = require("../helpers/status");

// Create-Order-Middleware
const createOrderMiddle = async (req, res, next) => {
  try {
    const { vehicleId } = req.body;
    await Order.updateMany({ vehicleId }, { remindOnOrder: false });
    next();
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// get-all-reminders-middleware
const getRemindMiddle = async (req, res, next) => {
  try {
    // Get the current date
    let today = new Date();

    // Subtract 5 days
    let fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    console.log(fiveDaysAgo);
    req.body = { remindDate: fiveDaysAgo };
    next();
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createOrderMiddle, getRemindMiddle };
