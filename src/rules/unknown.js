const PackageJson = require('../PackageJson.js');

const rule = {
  meta: {
    type: "problem",
    messages: {
      unknown: "Package '{{ dependency }}' is not on the tech radar. See {{documentation}} for more details.",
    },
    docs: {
      description: "avoid using packages that are not on the tech radar",
      category: "Possible Errors",
      url: "https://github.com/acumimous/eslint-plugin-tech-radar/blob/master/docs/rules/adopt.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          adopt: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const { adopt = [], hold = [], ignore = [], documentation } = (context.options[0] || {});

        const { text } = context.getSourceCode();
        const packageJson = new PackageJson(text);

        packageJson.forEachDependencySet((dependencies) => {
          Object.keys(dependencies).forEach((dependency) => {

            if (!adopt.includes(dependency) && !hold.includes(dependency) && !ignore.includes(dependency)) {
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
