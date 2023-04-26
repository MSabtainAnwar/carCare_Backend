const getMonthDays = (year, month) => {
  const date = new Date(year, month, 1);

  // Set the date to the last day of the month
  date.setMonth(month + 1);
  date.setDate(0);

  // Get the number of days in the month
  const daysInMonth = date.getDate();
  return daysInMonth;
};

module.exports = getMonthDays;
