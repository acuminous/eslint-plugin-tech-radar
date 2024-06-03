const Papa = require('papaparse');

const EMPTY_RADAR = { hold: [], assess: [], trial: [], adopt: [] };

module.exports = function parse(csv, quadrant) {
  const results = Papa.parse(csv, { header: true, skipEmptyLines: true });
  if (results.errors.length > 0) throw Object.assign(new Error(), results.errors[0]);
  return results.data.filter(byQuadrant).reduce(toRadar, EMPTY_RADAR);

  function byQuadrant(entry) {
    return !quadrant || quadrant === entry.quadrant;
  }

  function toRadar(radar, { ring, name }) {
    return {
      ...radar,
      [ring]: radar[ring].concat(name),
    };
  }

};
