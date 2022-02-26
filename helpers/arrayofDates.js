const generateArrayOfDates = (from, to) => {
  let arr = [];
  let dt = new Date(to);
  from = new Date(from);
  while (dt <= from) {
    arr.push(new Date(dt).toLocaleDateString());
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

module.exports = generateArrayOfDates;
