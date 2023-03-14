const {
  ProductBuying,
  ProductSaling,
  ProductHistory,
} = require("../models/model.product");
const responseStatus = require("../helpers/status");

// For-Buy-Product
const createBuyingMiddle = async (req, res, next) => {
  try {
    const { name } = req.body;
    const findProduct = await ProductBuying.findOne({ name }, null, {
      runValidators: true,
    });
    if (findProduct) {
      res
        .status(409)
        .json(responseStatus(false, "conflict", "Product Name already exist."));
    } else {
      next();
    }
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// For-Sale-Product
const createSelingMiddle = async (req, res, next) => {
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
    const findProduct = await ProductBuying.findOne({ _id: productId });
    if (quantity <= findProduct.quantity.toString()) {
      // Deduct-quantity-from-Buy-table
      await ProductBuying.findByIdAndUpdate(
        { _id: productId },
        { quantity: findProduct.quantity.toString() - quantity }
      );
      // Create-Product-History
      const createHistory = await new ProductHistory({
        customerName,
        name,
        description,
        quantity,
        salePrice,
        discount,
        productId,
      }).save();
      if (createHistory) {
        next();
      }
    } else {
      res
        .status(400)
        .json(
          responseStatus(
            false,
            "bad",
            "Please enter a quantity less than or equal to stock."
          )
        );
    }
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// For-Return_product
const returnProductMiddle = async (req, res, next) => {
  try {
    const { quantity, productId, saleHistoryId } = req.body;

    // delete-History
    await ProductHistory.findByIdAndDelete({
      _id: saleHistoryId,
    });
    // Add-quantity-in-Buy-table
    await ProductBuying.findByIdAndUpdate(
      { _id: productId },
      {
        $inc: {
          quantity: quantity,
        },
      }
    );
    next();
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = {
  createBuyingMiddle,
  createSelingMiddle,
  returnProductMiddle,
};
