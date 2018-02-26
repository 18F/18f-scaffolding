const Generator = require('yeoman-generator');
const allPrompts = require('../app/prompts');
const { onlyNewPrompts, saveUpdatedPrompts } = require('../app/prompts/utils');

const prompts = [
  allPrompts.repoName,
  allPrompts.description,
  allPrompts.frontendDeps,
  allPrompts.licenseShortName,
];

module.exports = class extends Generator {
  prompting() {
    return this.prompt(onlyNewPrompts(this.config, prompts))
      .then(saveUpdatedPrompts(this.config, prompts));
  }

  configuring() {
    if (this.config.get('frontendDeps')) {
      this.log('Configuring npm now...');
      this.composeWith(require.resolve('generator-npm-init/app'), {
        name: this.config.get('repoName'),
        description: this.config.get('description'),
        repo: `https://github.com/18F/${this.config.get('repoName')}`,
        author: '18f',
        license: this.config.get('licenseShortName'),
      });
    }
  }
};
