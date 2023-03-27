const express = require("express");
const bodyParser = require("body-parser");

// Routes
const adminRoute = require("../routes/admin");
const customerRoute = require("../routes/customer");
const vehicleRoute = require("../routes/vehicle");
const expenseRoute = require("../routes/route.expense");
const productRoute = require("../routes/route.product");
const servicesRoute = require("../routes/route.services");
const orderRoutes = require("../routes/route.order");

module.exports = (app) => {
  // bodyParser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.json());

  // Routes
  app.use("/admin", adminRoute);
  app.use("/customer", customerRoute);
  app.use("/vehicle", vehicleRoute);
  app.use("/expense", expenseRoute);
  app.use("/product", productRoute);
  app.use("/service", servicesRoute);
  app.use("/order", orderRoutes);
};
