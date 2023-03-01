const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
// colors
const colors = require("./src/loader/colors");
// config
const config = require("./src/config/config");

// Loaders
app.use(cookieParser());
require("./src/loader/compression")(app);
require("./src/loader/cors")(app);
require("./src/loader/db")();
require("./src/loader/routers")(app);

// Initial-Roure
app.get("/", (req, res) => {
  res.send("Initial route Running 💻");
});

// Listing
app.listen(config.port, () => {
  console.log(
    colors.fg.yellow,
    `
    ###########################
    💥  listening on port ${config.port} 💥
    ###########################`,
    colors.reset
  );
});
