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
    let { title, pageNo, perPage } = req.body;
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

    await Expense.find(...conditions)
      .skip(perPage * pageNo - perPage)
      .limit(perPage)
      .exec(async (err, data) => {
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
