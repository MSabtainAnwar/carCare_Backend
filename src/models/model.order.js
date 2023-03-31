const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "customer Id must be required."],
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "vehicle Id must be required."],
    },
    servicesId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Services",
    },
    otherServices: {
      type: [Object],
    },
    productId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ProductHistory",
    },
    currentMileage: {
      type: Number,
      default: 0,
    },
    bestKM: {
      type: Number,
      default: 0,
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    lastRemindDate: {
      type: Date,
      default: null,
    },
    remindNumber: {
      type: Number,
      default: 0,
    },
    remindOnOrder: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: [true, "Total Amount must be required."],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
