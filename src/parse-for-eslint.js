const { parseScript } = require("esprima");

// We parse the JSON as JS, but since non of the rules use the AST, we don't fix the locations.
function parseForESLint(text, options) {
  const code = `(${text});`;

  try {
    const ast = parseScript(code, options);
    return { ast };
  } catch (error) {
    try {
      JSON.parse(text);
    } catch (parseError) {
      error.message = parseError.message;
    }

    throw error;
  }
}

module.exports = { parseForESLint };
