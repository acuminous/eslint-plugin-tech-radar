# eslint-plugin-tech-radar

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-tech-radar.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-tech-radar)
[![Node.js CI](https://github.com/acuminous/eslint-plugin-tech-radar/workflows/Node.js%20CI/badge.svg)](https://github.com/acuminous/eslint-plugin-tech-radar/actions?query=workflow%3A%22Node.js+CI%22)
[![Code Climate](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar/badges/gpa.svg)](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar)
[![Test Coverage](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar/badges/coverage.svg)](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar/coverage)
[![Discover zUnit](https://img.shields.io/badge/Discover-zUnit-brightgreen)](https://www.npmjs.com/package/zunit)

A [tech radar](https://github.com/thoughtworks/build-your-own-radar) unfortunately won't stop engineering teams [installing modules they shouldn't](https://www.stephen-cresswell.com/2024/04/17/prisma-and-the-naivety-of-crowds.html). As Jeff Bezos says, "Good intentions don't work, good mechanisms do". One not very good mechanism is to install a private npm repository, but this blocks both direct and transitive dependencies, making it impractical to maintain. Another is to scan repositories looking for violations, but this is too late.

Instead, the approach taken by this module is to write a custom eslint plugin for checking the dependencies listed in package.json. The rules can be defined in a [shared configuration](https://eslint.org/docs/latest/extend/shareable-configs), and just like eslint, run automatically on pre-commit/pre-push hooks and as part of a CI/CD pipeline. You also have a familiar escape hatch, should teams need to downgrade, ignore or reconfigure rules on a repository by repository basis. Better yet, changes to the rules will naturally be accompanied by documented discussion in the form of issues and/or pull requests.

One snag with this approach is that the local install of the shared configuration must always be up-to-date. For this reason, eslint-plugin-tech-radar also includes a [rule](#tech-radarlatest) for ensuring that the latest version of a module is installed. Configure this with the name of your shared configuration module, and the linter will fail if a more recent version of the lint rules are available.

## How to use

1. Create a shared configuration similar to [this example](https://github.com/acuminous/eslint-plugin-tech-radar/tree/main/examples/eslint-config-acuminous-shared). It is best to export both the tech radar json file and eslint configuration to make it easier to ignore specific dependencies on a repository by repository basis.

2. Include the shared configuration in your application's eslint rules, as per [this example](https://github.com/acuminous/eslint-plugin-tech-radar/tree/main/examples/application).


## Rules

### tech-radar/adherence

Reports packages that that do not adhere to the tech radar

```js
  "tech-radar/adherence": [
    "error",
    {
      "hold": [
        "prisma",
        "winston",
        "bunyan"
      ],
      "assess": [
        "@pgtyped/query"
      ],
      "trial": [
        "orchid-orm"
      ],
      "adopt": [
        "pino",
        "sequelize"
      ],
      "ignore": [
       ],
      "documentation": "https://github.com/my-organisation/tech-radar"
    }
  ]
``` 

The linter will fail if package.json includes a dependency that is on hold or under assessment. Use the `ignore` array to suppress errors about a dependency without removing it from `hold` or `access`. Works with production, development, peer and optional dependencies.

### tech-radar/latest

Requires the latest version of a module is installed. Works with production, development, peer and optional dependencies (if installed).

```js
  "tech-radar/latest": [
    "error",
    {
      "packages": [
        "eslint-config-my-organisation"
      ]
    }
  ]
```


