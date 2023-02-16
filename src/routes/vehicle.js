const express = require("express");
const router = express.Router();

// middleware
const { createVehicleMiddle } = require("../middleware/vehicle");
// Controllers
const { createVehicle, vehicleList } = require("../controllers/vehicle");

// create-vehicle
router.post("/create", createVehicleMiddle, createVehicle);

// vehicle-list
router.post("/list", vehicleList);

module.exports = router;
