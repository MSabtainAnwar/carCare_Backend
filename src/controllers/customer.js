const Vehicle = require("../models/vehicle");
const Customer = require("../models/customer");
const responseStatus = require("../helpers/status");

// Create-Customer
const createCustomer = async (req, res) => {
  try {
    const { customerId, vehicleNo, vehicleBrand, vehicleModel } = req.body;
    if (vehicleNo !== "" && vehicleBrand !== "" && vehicleModel !== "") {
      const createVehicle = await new Vehicle({
        customerId,
        vehicleNo,
        vehicleBrand,
        vehicleModel,
      }).save();
    }
    res.status(201).json(responseStatus(true, "created", "Customer", ""));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// get-customer-list
const getCustomerList = async (req, res) => {
  try {
    let { pageNo, perPage, filter, status } = req.body;
    console.log(filter);
    pageNo = pageNo || 1;

    let conditions = [];

    // if name is exist
    if (filter.name !== "") {
      conditions.push({ name: { $regex: `${filter.name}`, $options: "i" } });
    }

    // if phone is exist
    if (filter.phone !== "") {
      conditions.push({ phone: { $regex: `${filter.phone}`, $options: "i" } });
    }

    // lookup to get vehicles data
    const query = [
      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "customerId",
          as: "vehicles",
        },
      },
    ];

    // filter vehicle No from vehicles array that get to vehicle model
    if (filter.vehicleNo !== "") {
      query.push({
        $match: {
          "vehicles.vehicleNo": {
            $regex: `${filter.vehicleNo}`,
            $options: "i",
          },
        },
      });
    }

    // filter vehicle Brand from vehicles array that get to vehicle model
    if (filter.vehicleBrand !== "") {
      query.push({
        $match: {
          "vehicles.vehicleBrand": {
            $regex: `${filter.vehicleBrand}`,
            $options: "i",
          },
        },
      });
    }

    // filter vehicle Model from vehicles array that get to vehicle model
    if (filter.vehicleModel !== "") {
      query.push({
        $match: {
          "vehicles.vehicleModel": {
            $regex: `${filter.vehicleModel}`,
            $options: "i",
          },
        },
      });
    }

    if (conditions.length > 0) {
      query.push({
        $match: {
          $or: conditions,
        },
      });
    }

    await Customer.aggregate([
      {
        $match: {
          status,
        },
      },
      ...query,
      {
        $skip: perPage * pageNo - perPage,
      },
      {
        $limit: perPage,
      },
    ]).exec((err, data) => {
      Customer.find({ status: "active" })
        .count()
        .exec((err, count) => {
          if (err) {
            res.status(404).json(responseStatus(false, "not-found", `${err}`));
          }
          let finalData = {
            customers: data,
            currentPage: pageNo,
            pages: Math.ceil(count / perPage),
          };
          res
            .status(200)
            .json(responseStatus(true, "ok", "Success", finalData));
        });
    });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createCustomer, getCustomerList };
