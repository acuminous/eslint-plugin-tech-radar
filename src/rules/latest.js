const semver = require('semver');
const { syncApi: npm, formats: { jsonFormat: format } } = require('oubliette');
const PackageJson = require('../PackageJson');

const rule = {
  meta: {
    type: 'problem',
    messages: {
      stale: "Package '{{ dependency }}' version must be {{version}}.",
      missing: "Package '{{ dependency }}' is not installed.",
    },
    docs: {
      description: 'use latest versions of specified dependencies',
      category: 'Possible Errors',
      url: 'https://github.com/acumimous/eslint-plugin-tech-radar/blob/master/docs/rules/latest.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          packages: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {
      'Program:exit': (node) => {
        if (!PackageJson.isPackageJsonFile(context.getFilename())) return;
        const { packages = [] } = (context.options[0] || {});

        const { text } = context.getSourceCode();
        const packageJson = new PackageJson(text);

        packageJson.forEachDependencySet((dependencies) => {
          Object.keys(dependencies).forEach((dependency) => {

            if (!packages.includes(dependency)) return;

            const expression = dependencies[dependency];
            if (!semver.valid(expression) && !semver.validRange(expression)) return;

            const { [dependency]: installed } = npm({ format }).ls({ json: true }).dependencies || {};
            if (!installed) {
              context.report({
                node,
                messageId: 'missing',
                data: {
                  dependency,
                },
              });
              return;
            }

            const latest = npm({ format }).view(dependency, { json: true });

            if (!semver.eq(installed.version, latest.version)) {
              context.report({
                node,
                messageId: 'stale',
                data: {
                  dependency,
                  version: latest.version,
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
