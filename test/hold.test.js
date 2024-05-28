const path = require('node:path');
const { ESLint } = require("eslint");

describe('tech-radar/hold', () => {
  it('should report held packages', async () => {
    const results = await createLinter('hold', {
      'tech-radar/hold': [
        'error',
        {
          hold: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/issues/123',
        }
      ],
    }).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/hold',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'messageId',
      'held',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'message',
      "Package 'foo' is on hold. See https://github.com/acuminous/issues/123 for more details.",
    );
  });

  it('should ignore exceptions', async () => {
    const results = await createLinter('hold', {
      "tech-radar/hold": [
        "error",
        {
          hold: [
            'foo',
          ],
          ignore: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/issues/123',
        }
      ],
    }).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should ignore other packages', async () => {
    const results = await createLinter('hold', {
      'tech-radar/hold': [
        'error',
        {
          hold: [
            'bar',
          ],
          documentation: 'https://github.com/acuminous/issues/123',
        }
      ],
    }).lintFiles("package.json");

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
