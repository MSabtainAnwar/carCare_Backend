const Admin = require("../models/admin");
// status-helper
const responseStatus = require("../helpers/status");
//config
const config = require("../config/config");

// Register-Admin
const registerAdmin = async (req, res) => {
  try {
    const createAdmin = await new Admin(req.body).save();
    res.status(201).json(responseStatus(true, "created", "Admin", ""));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Login-Admin
const loginAdmin = async (req, res) => {
  try {
    const data = req.body;
    let updateAdmin = await data.createToken(config.jwtSecretKey);
    if (updateAdmin) {
      const adminData = await Admin.findOne({
        _id: data._id.toString(),
      }).select("-token -password");
      res.status(200).json(responseStatus(true, "ok", "Success", adminData));
    }
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// verify-admin-token-by-id
const verifyAdminToken = async (req, res) => {
  try {
    const id = req.params.id;
    const adminData = await Admin.findOne({ _id: id }).select(
      "-token -password"
    );
    res.status(200).json(responseStatus(true, "ok", "Success", adminData));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { registerAdmin, loginAdmin, verifyAdminToken };
