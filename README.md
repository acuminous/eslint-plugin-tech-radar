# eslint-plugin-tech-radar

Maintaining a tech radar won't stop engineering teams installing modules they shouldn't. When good intentions fail, find a good mechanism instead. One option is to install a private npm repository, but this blocks both direct and transitive dependencies, making it impractical to maintain. Another option is to scan repositories looking for illegal dependencies, but this is just slightly too late.

Instead, the approach taken by this module is to write a custom eslint plugin for checking the dependencies listed in package.json. The rules can be defined in a [shared configuration](https://eslint.org/docs/latest/extend/shareable-configs), and just like eslint, run automatically on pre-commit/pre-push hooks and as part of a CI/CD pipeline. You also have a familiar escape hatch, should teams need to downgrade, ignore or reconfigure rules on a repository by repository basis.

One gotcha is that to be useful the latest shareable configuration must always be installed. For this reason, the plugin includes a rule for checking that the latest version of a module is installed.

## Rules

### tech-radar/hold

Reports packages that should be avoided

```js
  "tech-radar/hold": [
    "error",
    {
      "hold": [
        "prisma"
      ],
      "documentation": "https://github.com/acuminouns/engineering/wiki/tech-radar/hold"
    }
  ]
```  

### tech-radar/unknown

Reports packages that are not included in the tech radar

```js
  "tech-radar/hold": [
    "error",
    {
      "adopt": [
        "pino",
        "pino-pretty",
      ],
      "hold": [
        "prisma"
      ],
      "documentation": "https://github.com/acuminouns/engineering/wiki/tech-radar/adoption-process"
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
        "eslint-config-shared-organisation-rules"
      ]
    }
  ]
```
