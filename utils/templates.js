const fs = require("fs");
const ejs = require("ejs");

exports.renderTemplate = (path, ...argsRest) => {
  const content = fs.readFileSync(path).toString("utf-8");
  const rendered = ejs.render(content, ...argsRest);
  return rendered;
};
