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
          cwd: {
            type: 'string',
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
        const { packages = [], cwd } = (context.options[0] || {});
        const npmOptions = { cwd, stdio: 'pipe' };

        const { text } = context.getSourceCode();
        const packageJson = new PackageJson(text);

        packageJson.forEachDependencySet((dependencies, set) => {
          Object.keys(dependencies).forEach((dependency) => {

            if (!packages.includes(dependency)) return;
            if (isUrl(dependencies[dependency])) return;

            const installed = getInstalledPackage(npmOptions, dependency);
            if (!installed?.version || installed.missing) {
              if (set === 'optionalDependencies') return;
              context.report({ node, messageId: 'missing', data: { dependency } });
              return;
            }

            const latest = getLatestPackage(npmOptions, dependency);

            if (!semver.eq(installed.version, latest.version)) {
              context.report({ node, messageId: 'stale', data: { dependency, version: latest.version } });
            }
          });
        });
      },
    };
  },
};

function isUrl(expression) {
  return expression.match(/^(?:file:|git:|github:|git\+ssh:|git\+https:|git\+http:|https:|http:)/);
}

function getInstalledPackage(options, dependency) {
  try {
    const { [dependency]: installed } = npm({ options, format }).ls({ json: true }).dependencies || {};
    return installed;
  } catch (err) {
    if (!err.stdout) throw err;
    const output = String(err.stdout);
    try {
      const json = JSON.parse(output);
      const { [dependency]: installed } = json.dependencies || {};
      return installed;
    } catch (_) {
      throw new Error(`Error listing dependencies:\n${output}`);
    }
  }
}

function getLatestPackage(options, dependency) {
  return npm({ options, format }).view(dependency, { json: true });
}

module.exports = { rule };
