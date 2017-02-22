const Generator = require('yeoman-generator');
const sharedConfig = require('../shared-config');
const todo = require('../todo');

module.exports = class extends Generator {
  prompting() {
    return this.prompt(
      sharedConfig.promptsFor(this.config,
                              sharedConfig.repoNamePrompt,
                              sharedConfig.primaryLanguagePrompt,
                              sharedConfig.runCommandPrompt))
      .then(
      sharedConfig.saveResultsTo(this.config,
                                 sharedConfig.repoNamePrompt,
                                 sharedConfig.primaryLanguagePrompt,
                                 sharedConfig.runCommandPrompt));
  }

  writing() {
    if (this.config.get('runCommand') === sharedConfig.runCommandPrompt.default) {
      todo.add(this.config, this.fs, {
        'Cloud.gov Manifests': ['Procfile\'s "run" command'],
      });
    }
    todo.add(this.config, this.fs, {
      'Cloud.gov Manifests': [
        'Run `cf create-service aws-rds medium-psql database` in each env',
      ] });
    this.fs.copyTpl(this.templatePath('**'), this.destinationPath(),
                    this.config.getAll());
  }
};
