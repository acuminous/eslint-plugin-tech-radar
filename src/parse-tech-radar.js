const Papa = require('papaparse');

module.exports = function parse(csv) {
  const results = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });
  if (results.errors.length > 0) throw Object.assign(new Error(), results.errors[0]);
  return results.data.reduce((radar, { ring, name }) => {
    return {
      ...radar,
      [ring]: radar[ring].concat(name),
    };
  }, { hold: [], assess: [], trial: [], adopt: [] });
};
