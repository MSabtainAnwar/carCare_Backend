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
      { _id: productId },
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

module.exports = { createProductBuying, createProductSelling };
