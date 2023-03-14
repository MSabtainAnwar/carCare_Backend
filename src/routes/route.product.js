const express = require("express");
const router = express.Router();

// MiddleWares
const {
  createBuyingMiddle,
  createSelingMiddle,
  returnProductMiddle,
} = require("../middleware/middleware.product");
// Controllers
const {
  createProductBuying,
  createProductSelling,
  productReturn,
} = require("../controllers/controller.product");

// create-product-buying
router.post("/buy/create", createBuyingMiddle, createProductBuying);
// create-product-selling
router.post("/sale/create", createSelingMiddle, createProductSelling);
// return-product
router.post("/return", returnProductMiddle, productReturn);

module.exports = router;
