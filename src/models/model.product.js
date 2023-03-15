const mongoose = require("mongoose");

// Schema-for-buy-products
const productBuySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required."],
    },
    description: {
      type: String,
    },
    quantity: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Quantity must be required."],
    },
    price: {
      type: Number,
      required: [true, "Price must be required."],
    },
    salePrice: {
      type: Number,
      required: [true, "Sale Price must be required."],
    },
    productType: {
      type: String,
      enum: ["solid", "liquid"],
    },
  },
  { timestamps: true }
);

// Schema-for-sale-products
const productSaleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required."],
    },
    description: {
      type: String,
    },
    quantity: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Quantity must be required."],
    },
    buyPrice: {
      type: Number,
      required: [true, "Buying Price must be required."],
    },
    salePrice: {
      type: Number,
      required: [true, "Sale Price must be required."],
    },
    profit: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    productId: {
      type: String,
      required: [true, "Product ID must be required."],
    },
  },
  { timestamps: true }
);

// Schema-for-sale-products-history
const productHistorySchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer Name must be required."],
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    quantity: {
      type: mongoose.Schema.Types.Decimal128,
    },
    buyPrice: {
      type: Number,
      required: [true, "Buying Price must be required."],
    },
    salePrice: {
      type: Number,
    },
    profit: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    productId: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProductBuying = mongoose.model("ProductBuying", productBuySchema);
const ProductSaling = mongoose.model("ProductSaling", productSaleSchema);
const ProductHistory = mongoose.model("ProductHistory", productHistorySchema);

module.exports = { ProductBuying, ProductSaling, ProductHistory };
