# adherence

Ensures that the used dependencies adhere to the organisation's tech radar.

Assuming the rule is used with the following options:

```json
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
``` 
\***\*Bad\*\***:

```json
{
  "dependencies": {
    "prisma": "^5.14.0"
  }
}
```

```json
{
  "dependencies": {
    "@pgtyped/query": "^2.3.0"
  }
}
```

```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

\***\*Good\*\***:

```json
{
  "dependencies": {
    "orchid-orm": "^1.28.2",
    "pino": "^9.1.0"
  }
}
```

## Options

- `hold: string[]`: An array of dependencies that are on hold.
- `assess: string[]`: An array of dependencies that are being assessed.
- `trial: string[]`: An array of dependencies that are being trialed.
- `adopt: string[]`: An array of dependencies that are allowed.
- `ignore: string[]`: An array of dependencies that should be ignored (overides hold and assess).
- `documentation: string`: A link to your organisation's tech-radar documentation
