const Vehicle = require("../models/vehicle");
const Customer = require("../models/customer");
const Order = require("../models/model.order");
const Expense = require("../models/model.expense");
const Services = require("../models/model.services");
const { ProductBuying, ProductHistory } = require("../models/model.product");
// helpers
const responseStatus = require("../helpers/status");
const getMonthDays = require("../helpers/getMonthDays");
const createArray = require("../helpers/createArray");

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

// sales-and-expense-graph-function
const getSalesAndExpenseChart = async (req, res) => {
  try {
    let { year, month } = req.body;
    month = Number(month);
    year = Number(year);
    let label = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // condition
    let query = {};
    if (month >= 0) {
      query = {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      };
    } else {
      query = { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) };
    }
    // get-Data-from-DB
    const expenses = await Expense.find({ createdAt: query });
    // products-profit
    const prodProfits = await ProductHistory.find({ createdAt: query });

    if (month >= 0) {
      let days = getMonthDays(year, month);
      label = createArray(days);
      const daysExpenses = new Array(days).fill(0);
      const daysProdProfit = new Array(days).fill(0);
      // get-expnese-according-to-Days
      expenses.forEach((expense) => {
        const day = new Date(expense.createdAt).getDate();
        daysExpenses[day - 1] += expense.amount;
      });
      // get-products-profit-according-to-Days
      prodProfits.forEach((profit) => {
        const day = new Date(profit.createdAt).getDate();
        daysProdProfit[day - 1] += profit.profit;
      });
      res.status(200).json(
        responseStatus(true, "ok", "Success", {
          expenseValues: daysExpenses,
          salesValues: daysProdProfit,
          label,
        })
      );
    } else {
      // Group expenses by month
      const monthlyExpenses = new Array(12).fill(0);
      const monthlyProdProfit = new Array(12).fill(0);
      // get-expense
      expenses.forEach((expense) => {
        const month = expense.createdAt.getMonth();
        monthlyExpenses[month] += expense.amount;
      });
      // get-product-profit
      prodProfits.forEach((profit) => {
        const month = profit.createdAt.getMonth();
        monthlyProdProfit[month] += profit.profit;
      });
      res.status(200).json(
        responseStatus(true, "ok", "Success", {
          expenseValues: monthlyExpenses,
          salesValues: monthlyProdProfit,
          label,
        })
      );
    }
  } catch (error) {}
};

module.exports = { getDashboardCounts, getSalesAndExpenseChart };
