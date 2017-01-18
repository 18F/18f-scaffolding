'use strict';
var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  initializing: function () {
    this.composeWith(require.resolve('../license'));
    this.composeWith(require.resolve('../readme'));
  }
});
