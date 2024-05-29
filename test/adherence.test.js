const path = require('node:path');
const { ESLint } = require('eslint');

describe('tech-radar/adherence', () => {

  const cwd = path.resolve(__dirname, 'fixtures', 'adherence');

  it('should report held packages', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          hold: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/tech-radar',
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/adherence',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'messageId',
      'discouraged',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'message',
      "Package 'foo' is discouraged. See https://github.com/acuminous/tech-radar for more details.",
    );
  });

  it('should report held packages that are duplicated in another "ring"', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          hold: [
            'foo',
          ],
          adopt: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/tech-radar',
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/adherence',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'messageId',
      'discouraged',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'message',
      "Package 'foo' is discouraged. See https://github.com/acuminous/tech-radar for more details.",
    );
  });

  it('should report held packages that are also "ignored"', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          hold: [
            'foo',
          ],
          ignore: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/tech-radar',
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should allow adopted packages', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          adopt: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/tech-radar',
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should report assess packages', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          assess: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/tech-radar',
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/adherence',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'messageId',
      'assessment',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'message',
      "Package 'foo' is being assessed and should not be depended upon. See https://github.com/acuminous/tech-radar for more details.",
    );
  });

  it('should allow trial packages', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          trial: [
            'foo',
          ],
          documentation: 'https://github.com/acuminous/tech-radar',
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should report unknown packages', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          documentation: 'https://github.com/acuminous/wiki',
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/adherence',
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

  it('should tolerate unknown packages that are ignored', async () => {
    const results = await createLinter({
      'tech-radar/adherence': [
        'error',
        {
          documentation: 'https://github.com/acuminous/wiki',
          ignore: [
            'foo',
          ],
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  function createLinter(rules) {
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
      useEslintrc: false,
    });
  }
});
