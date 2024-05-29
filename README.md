# eslint-plugin-tech-radar

A tech radar unfortunately won't stop engineering teams [choosing modules they shouldn't](https://www.stephen-cresswell.com/2024/04/17/prisma-and-the-naivety-of-crowds.html). When good intentions fail, use a good mechanism instead. One option is to install a private npm repository, but this blocks both direct and transitive dependencies, making it impractical to maintain. Another option is to scan repositories looking for illegal dependencies, but this is just slightly too late.

Instead, the approach taken by this module is to write a custom eslint plugin for checking the dependencies listed in package.json. The rules can be defined in a [shared configuration](https://eslint.org/docs/latest/extend/shareable-configs), and just like eslint, run automatically on pre-commit/pre-push hooks and as part of a CI/CD pipeline. You also have a familiar escape hatch, should teams need to downgrade, ignore or reconfigure rules on a repository by repository basis.

One gotcha is that the local install of the shared configuration must always be up-to-date. For this reason, eslint-plugin-tech-radar also includes a rule for ensuring that the latest version of a module is installed.

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
      "access": [
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

### tech-radar/latest

Requires the latest version of a module is installed

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


