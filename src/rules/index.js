const { rule: hold } = require("./hold");
const { rule: latest } = require("./latest");
const { rule: unknown } = require("./unknown");

const rules = {
  hold,
  latest,
  unknown,
};

module.exports = { rules };
