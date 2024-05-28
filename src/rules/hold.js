const PackageJson = require('../PackageJson.js');

const rule = {
  meta: {
    type: "problem",
    messages: {
      held: "Package '{{ dependency }}' is on hold. See {{documentation}} for more details.",
    },
    docs: {
      description: "avoid using packages that are on hold",
      category: "Possible Errors",
      url: "https://github.com/acumimous/eslint-plugin-tech-radar/blob/master/docs/rules/hold.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          hold: {
            type: "array",
            items: {
              type: "string",
            },
          },
          ignore: {
            type: "array",
            items: {
              type: "string",
            },
          },
          documentation: {
            type: "string"
          }
        },
        required: [
          "documentation",
        ],
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    return {
      "Program:exit": (node) => {
        if (!PackageJson.isPackageJsonFile(context.getFilename())) return;

        const { hold = [], ignore = [], documentation } = (context.options[0] || {});

        const { text } = context.getSourceCode();
        const packageJson = new PackageJson(text);

        packageJson.forEachDependencySet((dependencies) => {
          Object.keys(dependencies).forEach((dependency) => {
            if (hold.includes(dependency) && !ignore.includes(dependency)) {
              context.report({
                node,
                messageId: 'held',
                data: {
                  dependency,
                  documentation,
                },
              });
            }
          });
        });
      },
    };
  },
};

module.exports = { rule };
