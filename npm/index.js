'use strict';

const Generator = require('yeoman-generator');
const sharedConfig = require('../shared-config');

module.exports = Generator.extend({
  prompting: function() {
    return this.prompt([{
      type    : 'confirm',
      name    : 'frontendDeps',
      message : 'Will this project have front end libraries/dependencies',
      default : true
    }]).then((answers) => {
      this.config.set('frontendDeps', answers.frontendDeps);
    });
  },

  configuring: function() {
    if (this.config.get('frontendDeps')) {
      this.log('Configuring npm now...');
      this.composeWith(require.resolve('generator-npm-init/app'), {
        name: this.config.get('repoName'),
        description: this.config.get('description'),
        repo: 'https://github.com/18F/' + this.config.get('repoName'),
        author: '18f',
        license: sharedConfig.licenseShortName
      });
    }
  }
});
