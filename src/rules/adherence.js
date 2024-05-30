const PackageJson = require('../PackageJson');

const rule = {
  meta: {
    type: 'problem',
    messages: {
      assessment: "Package '{{ dependency }}' is being assessed. See {{documentation}} for more details.",
      discouraged: "Package '{{ dependency }}' is discouraged. See {{documentation}} for more details.",
      unknown: "Package '{{ dependency }}' is not on the tech radar. See {{documentation}} for more details.",
    },
    docs: {
      description: 'avoid using packages that are on hold, being assessed or missing from the tech radar',
      category: 'Possible Errors',
      url: 'https://github.com/acumimous/eslint-plugin-tech-radar/blob/master/docs/rules/adherence.md',
    },
  },
  schema: [
    {
      type: 'object',
      properties: {
        hold: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        assess: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        trial: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        adopt: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        ignore: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        documentation: {
          type: 'string',
        },
      },
      required: [
        'documentation',
      ],
      additionalProperties: false,
    },
  ],
  create(context) {
    return {
      'Program:exit': (node) => {
        if (!PackageJson.isPackageJsonFile(context.getFilename())) return;

        const { hold = [], assess = [], trial = [], adopt = [], ignore = [], documentation } = (context.options[0] || {});
        const allowed = [].concat(trial, adopt, ignore);

        const { text } = context.getSourceCode();
        const packageJson = new PackageJson(text);

        packageJson.forEachDependencySet((dependencies) => {
          Object.keys(dependencies).forEach((dependency) => {
            const data = { dependency, documentation };
            if (hold.includes(dependency) && !ignore.includes(dependency)) {
              context.report({ node, messageId: 'discouraged', data });
            } else if (assess.includes(dependency)) {
              context.report({ node, messageId: 'assessment', data });
            } else if (!allowed.includes(dependency)) {
              context.report({ node, messageId: 'unknown', data });
            }
          });
        });
      },
    };
  },
};

module.exports = { rule };
