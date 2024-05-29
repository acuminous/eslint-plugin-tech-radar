const { rule: adherence } = require('./adherence');
const { rule: latest } = require('./latest');

const rules = {
  adherence,
  latest,
};

module.exports = { rules };
