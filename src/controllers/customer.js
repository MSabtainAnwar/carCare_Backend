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
    pageNo = pageNo || 1;

    // count-all-Active-customers
    const activeCustomer = await Customer.find({ status: "active" }).count();
    // count-all-Inactive-customers
    const inactiveCustomer = await Customer.find({
      status: "inactive",
    }).count();

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

    // wrapping-all-quries-in-aggrigation-piplines
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
      if (err) {
        res.status(404).json(responseStatus(false, "not-found", `${err}`));
      }
      let finalData = {
        customers: data,
        currentPage: pageNo,
        pages: Math.ceil(
          status === "active"
            ? activeCustomer / perPage
            : inactiveCustomer / perPage
        ),
        activeCustomer,
        inactiveCustomer,
      };
      res.status(200).json(responseStatus(true, "ok", "Success", finalData));
    });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Update-Status-By-Id
const updateCustomerStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    console.log(updatedCustomer);
    res
      .status(200)
      .json(
        responseStatus(
          true,
          "ok",
          "Successfully Update the Status!",
          updatedCustomer
        )
      );
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// update-customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updateCustomer = await Customer.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json(
        responseStatus(
          true,
          "ok",
          "Successfully Update the Customer!",
          updateCustomer
        )
      );
      console.log(updateCustomer);
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = {
  createCustomer,
  getCustomerList,
  updateCustomerStatusById,
  updateCustomer,
};
