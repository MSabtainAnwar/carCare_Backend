const Expense = require("../models/model.expense");
const responseStatus = require("../helpers/status");

// Create-Expense
const createExpense = async (req, res) => {
  try {
    const createExpense = await new Expense(req.body).save();
    res
      .status(201)
      .json(responseStatus(true, "created", "Expense", createExpense));
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

// Expense-List
const expenseList = async (req, res) => {
  try {
    let { title, pageNo, perPage, fromDate, toDate } = req.body;
    console.log(fromDate, toDate);
    let dateFilter = {};
    pageNo = pageNo || 1;

    const conditions = [];

    // if-vehicle-no-is Available
    if (title !== "") {
      conditions.push({
        title: {
          $regex: `${title}`,
          $options: "i",
        },
      });
    }

    if (fromDate !== "") {
      fromDate = new Date(`${fromDate}T00:00:00.000Z`);
      dateFilter = { ...dateFilter, $gte: fromDate };
    }

    if (toDate !== "") {
      toDate = new Date(`${toDate}T23:59:59.999Z`);
      dateFilter = { ...dateFilter, $lte: toDate };
    }

    if (fromDate !== "" || toDate !== "") {
      conditions.push({ createdAt: dateFilter });
    }

    console.log(conditions);

    await Expense.find(...conditions)
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .exec(async (err, data) => {
        console.log(data);
        if (err) {
          res.status(404).json(responseStatus(false, "not-found", `${err}`));
        }
        const count = await Expense.find().count();

        let finalData = {
          expenses: data,
          currentPage: pageNo,
          pages: Math.ceil(count / perPage),
        };
        res.status(200).json(responseStatus(true, "ok", "Success", finalData));
      });
  } catch (error) {
    res.status(404).json(responseStatus(false, "not-found", `${error}`));
  }
};

module.exports = { createExpense, expenseList };
