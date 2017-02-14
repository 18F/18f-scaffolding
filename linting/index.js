'use strict';

const Generator = require('yeoman-generator');
const sharedConfig = require('../shared-config');

module.exports = Generator.extend({
  writing: function() {
    // Add linting scripts to package.json:
    // "lint-css": "node node_modules/.bin/18f-stylelint-rules 'css/**/*.css'",
    // "lint-js": "eslint --ext .js --ext .jsx ./js",
  },

  install: function() {
    if (this.config.get('frontendDeps')) {
      this.npmInstall('@18f/stylelint-rules', { 'save-dev': true});
      this.npmInstall('eslint', { 'save-dev': true});
      this.npmInstall('eslint-config-airbnb', { 'save-dev': true});
    }
  }
});
