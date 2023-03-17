const handlePipelines = (value, field, conditionalArray) => {
  console.log(field);
  if (value !== "") {
    conditionalArray.push({
      [field]: {
        $regex: `${value}`,
        $options: "i",
      },
    });
  }
};

module.exports = handlePipelines;
