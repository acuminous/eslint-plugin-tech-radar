const path = require('node:path');
const { ESLint } = require("eslint");

describe('tech-radar/unknown', () => {
  it('should report unknown packages', async () => {
    const results = await createLinter('unknown', {
      "tech-radar/unknown": [
        "error",
        {
          documentation: "https://github.com/acuminous/wiki",
        }
      ],
    }).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/unknown',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'messageId',
      'unknown',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'message',
      "Package 'foo' is not on the tech radar. See https://github.com/acuminous/wiki for more details.",
    );
  });

  it('should ignore adopted packages', async () => {
    const results = await createLinter('unknown', {
      'tech-radar/unknown': [
        'error',
        {
          adopt: [
            'foo'
          ],
          documentation: 'https://github.com/acuminous/wiki'
        }
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should ignore held packages', async () => {
    const results = await createLinter('unknown', {
      'tech-radar/unknown': [
        'error',
        {
          hold: [
            'foo'
          ],
          documentation: 'https://github.com/acuminous/wiki'
        }
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should ignore ignored packages', async () => {
    const results = await createLinter('unknown', {
      'tech-radar/unknown': [
        'error',
        {
          ignore: [
            'foo'
          ],
          documentation: 'https://github.com/acuminous/wiki'
        }
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });
});

function createLinter(fixture, rules) {
  const cwd = path.resolve(__dirname, 'fixtures', fixture);

  return new ESLint({
    extensions: ['.json'],
    cwd,
    overrideConfig: {
      overrides: [
        {
          plugins: ['eslint-plugin-tech-radar'],
          files: ['*.json'],
          parser: 'eslint-plugin-tech-radar',
          rules,
        },
      ],
    },
    ignore: false,
    useEslintrc: true,
  });
}
