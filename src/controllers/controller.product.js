const {
  ProductBuying,
  ProductSaling,
  ProductHistory,
} = require("../models/model.product");
const responseStatus = require("../helpers/status");

// Create-Product-Buying
const createProductBuying = async (req, res) => {
  try {
    const createProduct = await new ProductBuying(req.body).save();
    res
      .status(201)
      .json(responseStatus(true, "created", "Product Buying", createProduct));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Create-Product-selling
const createProductSelling = async (req, res) => {
  try {
    let {
      customerName,
      name,
      description,
      buyPrice,
      salePrice,
      discount,
      productId,
      quantity,
    } = req.body;
    salePrice = salePrice - discount;
    const profit = salePrice - buyPrice;
    const saleProduct = await ProductSaling.findOneAndUpdate(
      { productId },
      {
        customerName,
        name,
        description,
        productId,
        $inc: {
          buyPrice: buyPrice,
          salePrice: salePrice,
          quantity: quantity,
          profit: profit,
          discount: discount,
        },
      },
      { upsert: true, new: true }
    );
    res
      .status(200)
      .json(
        responseStatus(true, "ok", "Successfully Product sold.", saleProduct)
      );
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Return-product
const productReturn = async (req, res) => {
  try {
    const { quantity, buyPrice, salePrice, discount, productId } = req.body;
    // update-salling-table
    const updateSale = await ProductSaling.findOneAndUpdate(
      { productId },
      {
        $inc: {
          buyPrice: -buyPrice,
          salePrice: -salePrice,
          quantity: -quantity,
          profit: -profit,
          discount: -discount,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json(
        responseStatus(true, "ok", "Successfully Product Returned.", updateSale)
      );
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createProductBuying, createProductSelling, productReturn };
