const path = require('node:path');
const { ESLint } = require('eslint');

describe('latest', () => {

  let cwd;

  beforeEach(() => {
    cwd = path.resolve(__dirname, 'fixtures', 'latest');
  });

  it('should report unknown config options', async () => {
    await expect(createLinter({
      'tech-radar/latest': [
        'error',
        {
          unknown: [
            'foo',
          ],
        },
      ],
    }).lintFiles('package.json')).rejects.toThrow('should NOT have additional properties');
  });

  it('should report stale semver packages', async () => {

    const results = await createLinter({
      'tech-radar/latest': [
        'error',
        {
          packages: [
            'chalk',
          ],
          cwd,
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/latest',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'messageId',
      'stale',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'message',
      "Package 'chalk' version must be 5.3.0.",
    );
  });

  it('should ignore fresh semver packages', async () => {
    const results = await createLinter({
      'tech-radar/latest': [
        'error',
        {
          packages: [
            'oubliette',
          ],
          cwd,
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should report stale latest packages', async () => {

    const results = await createLinter({
      'tech-radar/latest': [
        'error',
        {
          packages: [
            'zunit',
          ],
          cwd,
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 1);
    expect(results[0]).toHaveProperty('warningCount', 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      'ruleId',
      'tech-radar/latest',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'messageId',
      'stale',
    );
    expect(results[0].messages[0]).toHaveProperty(
      'message',
      "Package 'zunit' version must be 4.0.2.",
    );
  });

  it('should ignore fresh latest packages', async () => {

    const results = await createLinter({
      'tech-radar/latest': [
        'error',
        {
          packages: [
            'lodash',
          ],
          cwd,
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should tolerate local packages', async () => {
    const results = await createLinter({
      'tech-radar/latest': [
        'error',
        {
          packages: [
            'eslint-plugin-tech-radar',
          ],
          cwd,
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  it('should tolerate missing optional packages', async () => {
    const results = await createLinter({
      'tech-radar/latest': [
        'error',
        {
          packages: [
            'missing',
          ],
          cwd,
        },
      ],
    }).lintFiles('package.json');

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('errorCount', 0);
    expect(results[0]).toHaveProperty('warningCount', 0);
  });

  describe('latest-missing', () => {

    beforeEach(() => {
      cwd = path.resolve(__dirname, 'fixtures', 'latest-missing');
    });

    it('should report missing, mandatory packages', async () => {
      const results = await createLinter({
        'tech-radar/latest': [
          'error',
          {
            packages: [
              'missing',
            ],
            cwd,
          },
        ],
      }).lintFiles('package.json');

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('errorCount', 1);
      expect(results[0]).toHaveProperty('warningCount', 0);
      expect(results[0].messages).toHaveLength(1);
      expect(results[0].messages[0]).toHaveProperty(
        'ruleId',
        'tech-radar/latest',
      );
      expect(results[0].messages[0]).toHaveProperty(
        'messageId',
        'missing',
      );
      expect(results[0].messages[0]).toHaveProperty(
        'message',
        "Package 'missing' is not installed.",
      );
    });

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
