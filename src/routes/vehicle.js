const express = require("express");
const router = express.Router();

// middleware
const { createVehicleMiddle } = require("../middleware/vehicle");
// Controllers
const { createVehicle } = require("../controllers/vehicle");

// create-vehicle
router.post("/create", createVehicleMiddle, createVehicle);

module.exports = router;
