const Services = require("../models/model.services");
const responseStatus = require("../helpers/status");

// Create-Services
const createServices = async (req, res) => {
  try {
    const createService = await new Services(req.body).save();
    res
      .status(201)
      .json(responseStatus(true, "created", "Service", createService));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Services-List
const servicesList = async (req, res) => {
  try {
    let { name, pageNo, perPage } = req.body;
    pageNo = pageNo || 1;

    const conditions = [];

    // if-vehicle-no-is Available
    if (name !== "") {
      conditions.push({
        name: {
          $regex: `${name}`,
          $options: "i",
        },
      });
    }

    console.log(conditions);

    await Services.find(...conditions)
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .exec(async (err, data) => {
        console.log(data);
        if (err) {
          res.status(404).json(responseStatus(false, "not-found", `${err}`));
        }
        const count = await Services.find().count();

        let finalData = {
          services: data,
          currentPage: pageNo,
          pages: Math.ceil(count / perPage),
        };
        res.status(200).json(responseStatus(true, "ok", "Success", finalData));
      });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createServices, servicesList };
