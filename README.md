# eslint-plugin-tech-radar

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-tech-radar.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-tech-radar)
[![Node.js CI](https://github.com/acuminous/eslint-plugin-tech-radar/workflows/Node.js%20CI/badge.svg)](https://github.com/acuminous/eslint-plugin-tech-radar/actions?query=workflow%3A%22Node.js+CI%22)
[![Code Climate](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar/badges/gpa.svg)](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar)
[![Test Coverage](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar/badges/coverage.svg)](https://codeclimate.com/github/acuminous/eslint-plugin-tech-radar/coverage)
[![Discover zUnit](https://img.shields.io/badge/Discover-zUnit-brightgreen)](https://www.npmjs.com/package/zunit)

A [Tech Radar](https://github.com/thoughtworks/build-your-own-radar) unfortunately doesn't prevent engineers [installing modules they shouldn't](https://www.stephen-cresswell.com/2024/04/17/prisma-and-the-naivety-of-crowds.html). As Jeff Bezos says, "Good intentions don't work, good mechanisms do". One not very good mechanism is to use a private npm repository, but this blocks both direct and transitive dependencies, making it impractical. Another is to scan repositories looking for violations, but this is too late.

Instead, the approach taken by this module is to write a custom eslint plugin for validating the dependencies listed in package.json. The rules can be defined in a [shared configuration](https://eslint.org/docs/latest/extend/shareable-configs), and just like eslint, run automatically on pre-commit/pre-push hooks and as part of a CI/CD pipeline. You also have a familiar escape hatch, should teams need to downgrade, ignore or reconfigure rules on a repository by repository basis. Better yet, changes to the rules can be accompanied by documented discussion in the form of issues and/or pull requests.

A snag with this approach is that the local install of the shared configuration must always be up-to-date. For this reason, eslint-plugin-tech-radar also includes a [rule](#tech-radarlatest) for ensuring that the latest version of a module is installed. Prime this with the name of your shared configuration module, and the linter will fail if a more recent version of the lint rules are available. 

Another snag is that a pre-commit hook is still too late to prevent undesirable dependencies from being installed. You can work around this by running eslint from an [npm dependencies script](https://github.com/acuminous/eslint-plugin-tech-radar/blob/main/examples/application/package.json#L13).


## Instructions

1. Build a [Tech Radar](https://github.com/thoughtworks/build-your-own-radar) for your node dependences. e.g.
   ```csv
   name,ring,quadrant,isNew,description
   prisma,hold,backend,FALSE,Persistence
   winston,hold,backend,FALSE,Logging
   bunyan,hold,backend,FALSE,Logging
   @pgtyped/query,assess,TRUE,Persistence
   orchid-orm,trial,backend,FALSE,Persistence
   pino,adopt,backend,FALSE,Logging
   sequelize,adopt,backend,FALSE,Persistence
   ```
1. Export the Tech Radar to JSON rule configuration. 
   ```bash
   npx --package=eslint-plugin-tech-radar -- export-tech-radar radar.csv https://github.com/acuminous/tech-radar > radar.json
   ```
1. Create a shared configuration similar to this [example](https://github.com/acuminous/eslint-plugin-tech-radar/tree/main/examples/eslint-config-acuminous-shared). Export the Tech Radar [json file and eslint configuration](https://github.com/acuminous/eslint-plugin-tech-radar/blob/main/examples/eslint-config-acuminous-shared/index.js#L4-L7) from the module to make it easier to [ignore specific dependencies](https://github.com/acuminous/eslint-plugin-tech-radar/blob/main/examples/application/eslint.config.js#L13-L16) in the repositories that use it.

1. Include the shared configuration in your application's eslint rules as per this [example](https://github.com/acuminous/eslint-plugin-tech-radar/tree/main/examples/application).

## Rules

### tech-radar/adherence

Reports packages that that do not adhere to the Tech Radar

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
    "documentation": "https://github.com/your-organisation/tech-radar"
  }
]
``` 

The linter will fail if package.json includes a dependency that is on hold or under assessment. Use the `ignore` array to suppress errors about a dependency without removing it from `hold` or `access`. Works with production, development, peer and optional dependencies.

```
> eslint .

~/your-application/package.json
  1:1  error  Package 'slonik' is not on the tech radar. See https://github.com/your-organisation/tech-radar for more details  tech-radar/adherence
  1:1  error  Package 'prisma' is discouraged. See https://github.com/your-organisation/tech-radar for more details            tech-radar/adherence

✖ 2 problems (2 errors, 0 warnings)
```

### tech-radar/latest

Reports packages that are behind the latest version. 

```js
"tech-radar/latest": [
  "error",
  {
    "packages": [
      "eslint-config-your-organisation"
    ]
  }
]
```

Works with production, development, peer and optional dependencies (if installed). Ignores dependencies that are [specificed  by url](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#urls-as-dependencies).

```
> eslint .

~/your-application/package.json
  1:1  error  Package 'eslint-config-your-organisation' must be version 1.0.2.  tech-radar/latest

✖ 1 problem (1 error, 0 warnings)
```


## Acknowledgements
eslint-plugin-radar-tools was inspired by https://www.npmjs.com/package/eslint-plugin-package-json-dependencies
