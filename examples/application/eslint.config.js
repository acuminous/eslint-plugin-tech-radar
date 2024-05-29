/* eslint-disable import/no-extraneous-dependencies */
const plugin = require('eslint-plugin-tech-radar');
const { config, radar } = require('eslint-config-acuminous-shared');

module.exports = [
  ...config,
  {
    plugins: {
      'tech-radar': plugin,
    },
    rules: {
      // Override the tech-radar decision to put prisma on hold
      'tech-radar/adherence': ['error', {
        ...radar,
        ignore: [
          'prisma',
        ],
      }],

    },
  },
];
