const mongoose = require("mongoose");
// config
const config = require("../config/config");
// color
const colors = require("../loader/colors");

module.exports = function () {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(config.db)
    .then(() =>
      console.log(colors.fg.white, "Connected!", config.db, colors.reset)
    )
    .catch((error) => {
      console.error(error);
    });
};
