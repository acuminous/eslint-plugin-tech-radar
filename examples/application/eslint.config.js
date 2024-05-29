const plugin = require('eslint-plugin-tech-radar');
const { config, radar } = require('eslint-config-acuminous-shared');

module.exports = [
  ...config,
  {
    plugins: {
      "tech-radar": plugin
    },
    rules: {
      "tech-radar/adherence": ["error", {
        ...radar,
        ignore: [
          "prisma",
        ]
      }]

    }
  }
]
