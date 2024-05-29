const path = require('node:path');

module.exports = class PackageJson {

  #source;

  static isPackageJsonFile(filePath) {
    return path.basename(filePath) === 'package.json';
  }

  constructor(source) {
    this.#source = JSON.parse(source);
  }

  forEachDependencySet(fn) {
    ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach((key) => {
      fn(this.#source[key] || {}, key);
    });
  }
};
