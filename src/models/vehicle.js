const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema(
  {
    vehicleNo: {
      type: String,
      required: [true, "vehicle No must be required."],
    },
    vehicleBrand: {
      type: String,
      required: [true, "vehicle Brand must be required."],
    },
    vehicleModel: {
      type: String,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "customer Id must be required."],
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
