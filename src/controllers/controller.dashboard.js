const Vehicle = require("../models/vehicle");
const Customer = require("../models/customer");
const Order = require("../models/model.order");
const Expense = require("../models/model.expense");
const Services = require("../models/model.services");
const { ProductBuying, ProductHistory } = require("../models/model.product");

const responseStatus = require("../helpers/status");

// Get-Dashboard-Analytics-Counts
const getDashboardCounts = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.find().count();
    const totalCustomers = await Customer.find().count();
    const totalServices = await Services.find().count();
    const totalProducts = await ProductBuying.find().count();
    const totalReminders = await Order.find({ reminder: true });
    const expenseResult = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);
    // Total-Sales
    let totalSales = 0;
    // product-profit
    const productProfit = await ProductHistory.aggregate([
      {
        $group: {
          _id: null,
          prodProfit: { $sum: "$profit" },
        },
      },
    ]);
    totalSales = productProfit?.[0]?.prodProfit || 0;
    console.log("prod Profit", totalSales);
    // Fetch-Services-price-in-order-table
    const orderData = await Order.find().populate("servicesId");
    let servicesAmount = 0,
      otherServicesAmount = 0,
      discountAmount = 0;
    for (let i = 0; i < orderData.length; i++) {
      discountAmount += orderData[i]?.discount || 0;
      orderData[i].servicesId.forEach((service) => {
        servicesAmount += service?.price || 0;
      });
      orderData[i].otherServices.forEach((service) => {
        otherServicesAmount += service?.price || 0;
      });
    }
    console.log("servicesAmount", servicesAmount);
    console.log("discountAmount", discountAmount);
    console.log("otherServices", otherServicesAmount);
    totalSales += servicesAmount + otherServicesAmount - discountAmount;
    let totalProfit = totalSales - expenseResult?.[0]?.totalExpense || 0;

    console.log("totalSales", totalSales);

    // create-final-object
    const analyticsObj = {
      totalVehicles,
      totalCustomers,
      totalServices,
      totalProducts,
      totalExpense: expenseResult?.[0]?.totalExpense || 0,
      totalReminders: totalReminders?.length || 0,
      totalSale: totalSales,
      totalProfit,
    };
    res.status(200).json(responseStatus(true, "ok", "Success", analyticsObj));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { getDashboardCounts };
