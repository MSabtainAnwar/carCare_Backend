const mongoose = require("mongoose");
// validator
var validator = require("validator");
// Hash-password
const bcrypt = require("Bcrypt");
// JWT
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name must be required."],
    },
    lastName: {
      type: String,
      required: [true, "Last Name must be required."],
    },
    phone: {
      type: String,
      required: [true, "Phone must be required."],
      validate: [validator.isMobilePhone, "Invalid Phone Number"],
    },
    password: {
      type: String,
      required: [true, "Password must be required."],
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

//Methods-middleware
adminSchema.methods.createToken = async function (key) {
  try {
    console.log(this);
    const token = jwt.sign(
      {
        _id: this._id,
      },
      key,
      { expiresIn: "1d" }
    );
    this.token = token;
    await this.save();
    return this;
  } catch (error) {
    console.log(error);
  }
};

// Before Save data into database bcript the password
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
