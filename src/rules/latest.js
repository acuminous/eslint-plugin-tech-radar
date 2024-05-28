const semver = require('semver');
const { syncApi: npm, formats: { jsonFormat: format } } = require('oubliette');
const PackageJson = require('../PackageJson');

const rule = {
  meta: {
    type: "problem",
    messages: {
			stale: "Package '{{ dependency }}' version must be {{version}}.",
    },
    docs: {
      description: "use latest versions of specified dependencies",
      category: "Possible Errors",
      url: "https://github.com/acumimous/eslint-plugin-tech-radar/blob/master/docs/rules/latest.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          packages: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    return {
      "Program:exit": (node) => {
        if (!PackageJson.isPackageJsonFile(context.getFilename())) return;
        const { packages = [] } = (context.options[0] || {});

        const { text } = context.getSourceCode();
        const packageJson = new PackageJson(text);

        packageJson.forEachDependencySet((dependencies) => {
          Object.keys(dependencies).forEach((dependency) => {

            if (!packages.includes(dependency)) return;

          	const installed = semver.minVersion(dependencies[dependency]).version;
            const { version: latest } = npm({ format }).view(dependency, { json: true });

            if (!semver.eq(installed, latest)) {
              context.report({
                node,
                messageId: 'stale',
                data: {
                  dependency,
                  version: latest,
                },
              });
            }
          });
        });
      },
    };
  },
};

module.exports = { rule }
