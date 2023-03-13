const express = require("express");
const router = express.Router();

// MiddleWares
const {
  createBuyingMiddle,
  createSelingMiddle,
} = require("../middleware/middleware.product");
// Controllers
const {
  createProductBuying,
  createProductSelling,
} = require("../controllers/controller.product");

// create-product-buying
router.post("/buy/create", createBuyingMiddle, createProductBuying);
// create-product-selling
router.post("/sale/create", createSelingMiddle, createProductSelling);

module.exports = router;
