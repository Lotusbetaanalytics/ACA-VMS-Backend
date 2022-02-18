const { sign } = require("jsonwebtoken");

const generateToken = (user) => {
  return sign({ user }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = generateToken;
