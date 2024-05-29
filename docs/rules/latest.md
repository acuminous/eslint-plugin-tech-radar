# latest

Ensures the latest version of a package is installed.

Assuming the rule is used with the following options and the current version of eslint-config-my-organsation is 1.0.1

```json
{
  "packages": [
    "eslint-config-my-organisation"
  ]
}
``` 
\***\*Bad\*\*** (if v1.0.0 is installed):

```json
{
  "devDependencies": {
    "eslint-config-my-organisation": "^1.0.0"
  }
}
```

\***\*Good\*\*** (if v1.0.1 is installed):

```json
{
  "devDependencies": {
    "eslint-config-my-organisation": "^1.0.0"
  }
}
```

## Options

- `packages: string[]`: An array of dependencies that must be installed at their latest versions.

