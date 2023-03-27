const mongoose = require("mongoose");

const servicesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be required."],
  },
  price: {
    type: Number,
    required: [true, "Price must be required."],
  },
  description: {
    type: String,
  },
});

const Services = mongoose.model("Services", servicesSchema);

module.exports = Services;
