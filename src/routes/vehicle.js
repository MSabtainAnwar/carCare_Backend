const express = require("express");
const router = express.Router();

// middleware
const { createVehicleMiddle } = require("../middleware/vehicle");
// Controllers
const {
  createVehicle,
  vehicleList,
  getVehicleByCustomerId,
} = require("../controllers/vehicle");

// create-vehicle
router.post("/create", createVehicleMiddle, createVehicle);

// vehicle-list
router.post("/list", vehicleList);

// get-vehicle-by-customer-ID
router.post("/specific-customer/:id", getVehicleByCustomerId);

module.exports = router;
