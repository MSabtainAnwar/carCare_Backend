const Vehicle = require("../models/vehicle");
const responseStatus = require("../helpers/status");

// Create-Vehicle
const createVehicle = async (req, res) => {
  try {
    const createVehicle = await new Vehicle(req.body).save();
    res
      .status(201)
      .json(responseStatus(true, "created", "Vehicle", createVehicle));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// all-vehicles-list
const vehicleList = async (req, res) => {
  try {
    let { vehicleNo, pageNo, perPage } = req.body;
    pageNo = pageNo || 1;

    const conditions = [];

    // if-vehicle-no-is Available
    if (vehicleNo !== "") {
      conditions.push({
        vehicleNo: {
          $regex: `${vehicleNo}`,
          $options: "i",
        },
      });
    }

    await Vehicle.find(...conditions)
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .exec(async (err, data) => {
        if (err) {
          res.status(404).json(responseStatus(false, "not-found", `${err}`));
        }
        const count = await Vehicle.find().count();

        let finalData = {
          vehicles: data,
          currentPage: pageNo,
          pages: Math.ceil(count / perPage),
        };
        res.status(200).json(responseStatus(true, "ok", "Success", finalData));
      });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createVehicle, vehicleList };
