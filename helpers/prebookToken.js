const randomString = require("randombytes");

function generateString() {
  return randomString(3).toString("hex");
}

module.exports = generateString;
