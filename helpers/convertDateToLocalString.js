const convertDate = (date) => {
  return new Date(date).toLocaleDateString();
};

module.exports = { convertDate };
