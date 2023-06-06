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

    await Order.find({
      createdAt: { $lte: remindDate },
      remindOnOrder: true,
      remindNumber: { $lt: 3 },
    }).exec(async (err, data) => {
      if (err) {
        res.status(404).json(responseStatus(false, "not-found", `${err}`));
      }

      const currentDate = new Date();
      const fiveDaysAgo = new Date(
        currentDate.getTime() - 1 * 24 * 60 * 60 * 1000
      ); // 5 days ago in milliseconds

      let finalArr = [];
      console.log(data);
      // check-the-last-reminder-is-5-days-ago
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.lastRemindDate) {
          if (data[i]?.lastRemindDate <= fiveDaysAgo) {
            finalArr.push(data[i]);
          }
        } else if (data[i]?.remindNumber === 0) {
          finalArr.push(data[i]);
        }
      }
      // check-if-the-array-have-the-reminder-records
      console.log(finalArr);
      if (finalArr.length > 0) {
        const filter = { _id: { $in: finalArr.map((doc) => doc._id) } };
        const update = { $set: { reminder: true } };
        const options = { multi: true, new: true };
        Order.updateMany(filter, update, options)
          .then(() =>
            Order.find(filter).populate(
              "customerId vehicleId servicesId productId"
            )
          )
          .then((docs) => {
            res.status(200).json(responseStatus(true, "ok", "Success", docs));
          })
          .catch((err) =>
            res.status(404).json(responseStatus(false, "not-found", `${err}`))
          );
      } else {
        res.status(200).json(responseStatus(true, "ok", "Success", finalArr));
      }
    });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Reminded-the-customer-of-order
const goToRemindCustomer = async (req, res) => {
  try {
    const { orderId } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      {
        $inc: { remindNumber: 1 },
        reminder: false,
        lastRemindDate: new Date(),
      },
      { new: true }
    );
    res.status(200).json(responseStatus(true, "ok", "Success", updatedOrder));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = {
  createOrder,
  getOrderListByCustomerId,
  getAllReminderOrder,
  goToRemindCustomer,
};
