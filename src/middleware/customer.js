// model
const Customer = require("../models/customer");
const Vehicle = require("../models/vehicle");
// status-helper
const responseStatus = require("../helpers/status");

const createCustomerMiddle = async (req, res, next) => {
  try {
    const { name, location, phone, whatsapp, vehicleNo, status } = req.body;
    const findPhone = await Customer.findOne({ phone });
    const findVehicleNo = await Vehicle.findOne({ vehicleNo });
    if (findPhone) {
      res
        .status(409)
        .json(responseStatus(false, "conflict", "Phone No already exist."));
    } else {
      if (findVehicleNo) {
        res
          .status(409)
          .json(responseStatus(false, "conflict", "Vehicle No already exist."));
      } else {
        const createCustomer = await new Customer({
          name,
          location,
          phone,
          whatsapp,
          status,
        }).save();
        req.body = { ...req.body, customerId: createCustomer._id };
        next();
      }
    }
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createCustomerMiddle };
