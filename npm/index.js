'use strict';

var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  prompting: function() {
    return this.prompt([{
      type    : 'confirm',
      name    : 'frontendDeps',
      message : 'Will this project have front end libraries/dependencies',
      default : true
    }]).then((answers) => {
      this.frontendDeps = answers.frontendDeps;
    });
  },

  configuring: function() {
    if (this.frontendDeps) {
      this.log('Configuring npm now...');
      this.composeWith(require.resolve('generator-npm-init/app'), {
        repo: 'https://github.com/18F/<%= destFolderName %>',
        author: '18f',
        license: 'CC0-1.0'
      });
    }
  }
});
