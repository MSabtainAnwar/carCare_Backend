const mongoose = require("mongoose");
// validator
var validator = require("validator");

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required."],
    },
    location: {
      type: String,
      required: [true, "Location must be required."],
    },
    phone: {
      type: String,
      required: [true, "Phone must be required."],
      validate: [validator.isMobilePhone, "Invalid Phone Number"],
    },
    whatsapp: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
