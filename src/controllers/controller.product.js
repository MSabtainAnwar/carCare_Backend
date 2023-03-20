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
        if (err) {
          res.status(404).json(responseStatus(false, "not-found", `${err}`));
        }
        const count = await ProductBuying.find().count();

        const response = {
          stockAmount,
          allStock: data,
          currentPage: pageNo,
          pages: Math.ceil(count / perPage),
          totalProducts: count,
        };
        res.status(200).json(responseStatus(true, "ok", "Success", response));
      });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Product-Sale-List
const productSaleList = async (req, res) => {
  try {
    let { name, pageNo, perPage } = req.body;
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

    await ProductSaling.find(...conditions)
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .exec(async (err, data) => {
        if (err) {
          res.status(404).json(responseStatus(false, "not-found", `${err}`));
        }
        const count = await ProductSaling.find().count();

        const response = {
          allSales: data,
          currentPage: pageNo,
          pages: Math.ceil(count / perPage),
        };
        res.status(200).json(responseStatus(true, "ok", "Success", response));
      });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Product-Sale-history-List
const productSaleHistoryList = async (req, res) => {
  try {
    let { filter, pageNo, perPage } = req.body;
    pageNo = pageNo || 1;
    let dateFilter = {};

    const conditions = [];

    // if-Product-name-is Available
    if (filter.name !== "") {
      conditions.push({
        name: {
          $regex: `${filter.name}`,
          $options: "i",
        },
      });
    }

    // if-Customer-name-is Available
    if (filter.customerName !== "") {
      conditions.push({
        customerName: {
          $regex: `${filter.customerName}`,
          $options: "i",
        },
      });
    }

    // if-fromDate-is-available
    if (filter.fromDate !== "") {
      filter.fromDate = new Date(`${filter.fromDate}T00:00:00.000Z`);
      dateFilter = { ...dateFilter, $gte: filter.fromDate };
    }

    // if-toDate-is-available
    if (filter.toDate !== "") {
      filter.toDate = new Date(`${filter.toDate}T23:59:59.999Z`);
      dateFilter = { ...dateFilter, $lte: filter.toDate };
    }

    if (filter.fromDate !== "" || filter.toDate !== "") {
      conditions.push({ createdAt: dateFilter });
    }

    await ProductHistory.find({ $or: conditions })
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .exec(async (err, data) => {
        if (err) {
          res.status(404).json(responseStatus(false, "not-found", `${err}`));
        }
        const count = await ProductHistory.find().count();

        let finalData = {
          productHistory: data,
          currentPage: pageNo,
          pages: Math.ceil(count / perPage),
        };
        res.status(200).json(responseStatus(true, "ok", "Success", finalData));
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
  productSaleList,
  productSaleHistoryList,
};
