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
      name,
      description,
      buyPrice,
      salePrice,
      discount,
      productId,
      quantity,
    } = req.body;

    salePrice = salePrice * quantity - discount;
    const profit = salePrice - buyPrice * quantity;
    const saleProduct = await ProductSaling.findOneAndUpdate(
      { productId },
      {
        name,
        description,
        productId,
        $inc: {
          buyPrice: buyPrice * quantity,
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
    let { quantity, buyPrice, salePrice, discount, productId, profit } =
      req.body;
    // total-saling-price
    let totalSale = salePrice * quantity - discount;
    // update-salling-table
    const updateSale = await ProductSaling.findOneAndUpdate(
      { productId },
      {
        $inc: {
          buyPrice: -buyPrice * quantity,
          salePrice: -totalSale,
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

// Product-Stock-List
const productStockList = async (req, res) => {
  try {
    let { stockAmount, name, pageNo, perPage } = req.body;
    pageNo = pageNo || 1;

    const conditions = [];

    // if-product-name-is Available
    if (name !== "") {
      conditions.push({
        name: {
          $regex: `${name}`,
          $options: "i",
        },
      });
    }

    await ProductBuying.find(...conditions)
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .exec(async (err, data) => {
        console.log(data);
        if (err) {
          res.status(404).json(responseStatus(false, "not-found", `${err}`));
        }
        const count = await ProductBuying.find().count();

        const response = {
          stockAmount,
          allStock: data,
          currentPage: pageNo,
          pages: Math.ceil(count / perPage),
        };
        res.status(200).json(responseStatus(true, "ok", "Success", response));
      });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = {
  createProductBuying,
  createProductSelling,
  productReturn,
  productStockList,
};
