// model
const Vehicle = require("../models/vehicle");
// status-helper
const responseStatus = require("../helpers/status");

const createVehicleMiddle = async (req, res, next) => {
  try {
    const { vehicleNo } = req.body;
    const findVehicleNo = await Vehicle.findOne({ vehicleNo });
    if (findVehicleNo) {
      res
        .status(409)
        .json(responseStatus(false, "conflict", "Vehicle No already exist."));
    } else {
      next();
    }
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createVehicleMiddle };
