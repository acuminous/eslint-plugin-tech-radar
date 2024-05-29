/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const plugin = require('eslint-plugin-tech-radar');
const radar = require('./dependency-radar.json');

module.exports = [{
  files: ['*.json'],
  plugins: {
    'tech-radar': plugin,
  },
  languageOptions: {
    parser: plugin,
  },
  rules: {
    // Ensure the latest version of this module is always installed
    'tech-radar/latest': [
      'error',
      {
        packages: [
          'eslint-config-acuminous-shared',
        ],
      },
    ],
    // Add the tech radar rule configuration
    'tech-radar/adherence': [
      'error',
      {
        ...radar,
      },
    ],
  },
}];
