const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  initializing() {
    this.composeWith(require.resolve('../license'));
    this.composeWith(require.resolve('../readme'));
    this.composeWith(require.resolve('../gitignores'));
    this.composeWith(require.resolve('../npm'));
    this.composeWith(require.resolve('../cf-manifest'));
    this.composeWith(require.resolve('../newrelic'));
  }
};
