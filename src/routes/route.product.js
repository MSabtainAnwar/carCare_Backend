const express = require("express");
const router = express.Router();

// MiddleWares
const {
  createBuyingMiddle,
  createSelingMiddle,
  returnProductMiddle,
  productStockMiddle,
} = require("../middleware/middleware.product");
// Controllers
const {
  createProductBuying,
  createProductSelling,
  productReturn,
  productStockList,
  productSaleList,
  productSaleHistoryList,
} = require("../controllers/controller.product");

// create-product-buying
router.post("/buy/create", createBuyingMiddle, createProductBuying);
// Get-All-Stock-List
router.post("/buy/list", productStockMiddle, productStockList);
// create-product-selling
router.post("/sale/create", createSelingMiddle, createProductSelling);
// get-all-sale-list
router.post("/sale/list", productSaleList);
// get-sale-history-list
router.post("/sale/history/list", productSaleHistoryList);
// return-product
router.post("/return", returnProductMiddle, productReturn);

module.exports = router;
