const path = require('node:path');
const { ESLint } = require("eslint");

describe("latest", () => {
  it("should report stale packages", async () => {
    const results = await createLinter('latest', {
      "tech-radar/latest": [
        "error",
        {
          packages: [
            "semver"
          ],
        }
      ],
    }).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty("errorCount", 1);
    expect(results[0]).toHaveProperty("warningCount", 0);
    expect(results[0].messages).toHaveLength(1);
    expect(results[0].messages[0]).toHaveProperty(
      "ruleId",
      "tech-radar/latest",
    );
    expect(results[0].messages[0]).toHaveProperty(
      "messageId",
      "stale",
    );
    expect(results[0].messages[0]).toHaveProperty(
      "message",
      "Package 'semver' version must be 7.6.2.",
    );
  });

  it("should ignore fresh packages", async () => {
    const results = await createLinter('latest', {
      "tech-radar/latest": [
        "error",
        {
          packages: [
            "oubliette"
          ],
        }
      ],
    }).lintFiles("package.json");

    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty("errorCount", 0);
    expect(results[0]).toHaveProperty("warningCount", 0);
  });
});

function createLinter(fixture, rules) {
  const cwd = path.resolve(__dirname, 'fixtures', fixture);

  return new ESLint({
    extensions: [".json"],
    cwd,
    overrideConfig: {
      overrides: [
        {
          plugins: ["eslint-plugin-tech-radar"],
          files: ["*.json"],
          parser: "eslint-plugin-tech-radar",
          rules,
        },
      ],
    },
    ignore: false,
    useEslintrc: true,
  });
}
