const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title must be required."],
    },
    amount: {
      type: Number,
      required: [true, "Amount must be required."],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
