const PackageJson = require('../PackageJson.js');

const rule = {
  meta: {
    type: "problem",
    messages: {
      discouraged: "Package '{{ dependency }}' is discouraged. See {{documentation}} for more details.",
      unknown: "Package '{{ dependency }}' is not on the tech radar. See {{documentation}} for more details.",
    },
    docs: {
      description: "avoid using packages that are on hold",
      category: "Possible Errors",
      url: "https://github.com/acumimous/eslint-plugin-tech-radar/blob/master/docs/rules/adherence.md",
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
          access: {
            type: "array",
            items: {
              type: "string",
            },
          },
          trial: {
            type: "array",
            items: {
              type: "string",
            },
          },
          adopt: {
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

        const { hold = [], access = [], trial = [], adopt = [], ignore = [], documentation } = (context.options[0] || {});
        const allowed = [].concat(access, trial, adopt, ignore);

        const { text } = context.getSourceCode();
        const packageJson = new PackageJson(text);

        packageJson.forEachDependencySet((dependencies) => {
          Object.keys(dependencies).forEach((dependency) => {
            if (hold.includes(dependency) && !ignore.includes(dependency)) {
              context.report({
                node,
                messageId: 'discouraged',
                data: {
                  dependency,
                  documentation,
                },
              });
            }
						else if (!allowed.includes(dependency)) {
				      context.report({
				        node,
				        messageId: 'unknown',
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
