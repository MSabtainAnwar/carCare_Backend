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
    year = Number(year || new Date().getFullYear());
    console.log(year);
    // by-default-year-labels
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
    // conditions
    let query = {};
    // if-month-is-availabale
    if (month >= 0) {
      query = {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      };
    } else {
      query = { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) };
    }
    // get-Expense-Data-from-DB
    const expenses = await Expense.find({ createdAt: query });
    // products-profit
    const prodProfits = await ProductHistory.find({ createdAt: query });
    // Order-Data
    const orderData = await Order.find({ createdAt: query }).populate(
      "servicesId"
    );

    // if-graph-calculate-the-value-on-the-basis-of-month-days
    if (month >= 0) {
      let days = getMonthDays(year, month);
      label = createArray(days);
      const daysExpenses = new Array(days).fill(0);
      const daysSales = new Array(days).fill(0);
      // get-expnese-according-to-Days
      expenses.forEach((expense) => {
        const day = new Date(expense.createdAt).getDate();
        daysExpenses[day - 1] += expense.amount;
      });
      // get-products-profit-according-to-Days
      prodProfits.forEach((profit) => {
        const day = new Date(profit.createdAt).getDate();
        daysSales[day - 1] += profit.profit;
      });
      // get-order-services-sale-according-to-days

      orderData.forEach((order) => {
        let servicesAmount = 0,
          otherServicesAmount = 0,
          discountAmount = 0;
        const day = new Date(order.createdAt).getDate();
        discountAmount += order?.discount || 0;
        order?.servicesId.forEach((service) => {
          servicesAmount += service?.price || 0;
        });
        order?.otherServices.forEach((service) => {
          otherServicesAmount += service?.price || 0;
        });
        let finalSale = servicesAmount + otherServicesAmount - discountAmount;
        console.log(finalSale);
        daysSales[day - 1] += finalSale;
      });
      // calculate-profit
      const daysProfit = daysSales.map(
        (num, index) => num - daysExpenses[index]
      );
      // Response
      res.status(200).json(
        responseStatus(true, "ok", "Success", {
          expenseValues: daysExpenses,
          salesValues: daysSales,
          profitValues: daysProfit,
          label,
        })
      );
      // if-graph-calculate-the-value-on-the-base-of-year
    } else {
      // Group expenses by month
      const monthlyExpenses = new Array(12).fill(0);
      const monthlySales = new Array(12).fill(0);
      // get-expense-for-1-year
      expenses.forEach((expense) => {
        const month = expense.createdAt.getMonth();
        monthlyExpenses[month] += expense.amount;
      });
      // get-product-profit-for-1-year
      prodProfits.forEach((profit) => {
        const month = profit.createdAt.getMonth();
        monthlySales[month] += profit.profit;
      });
      // get-order-sale-for-1-year
      orderData.forEach((order) => {
        let servicesAmount = 0,
          otherServicesAmount = 0,
          discountAmount = 0;
        const month = order?.createdAt.getMonth();
        discountAmount += order?.discount || 0;
        order?.servicesId.forEach((service) => {
          servicesAmount += service?.price || 0;
        });
        order?.otherServices.forEach((service) => {
          otherServicesAmount += service?.price || 0;
        });
        let finalSale = servicesAmount + otherServicesAmount - discountAmount;
        console.log(finalSale);
        monthlySales[month] += finalSale;
      });
      // calculate-profit
      const monthProfit = monthlySales?.map(
        (num, index) => num - monthlyExpenses[index]
      );
      // Response
      res.status(200).json(
        responseStatus(true, "ok", "Success", {
          expenseValues: monthlyExpenses,
          salesValues: monthlySales,
          profitValues: monthProfit,
          label,
        })
      );
    }
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { getDashboardCounts, getSalesAndExpenseChart };
