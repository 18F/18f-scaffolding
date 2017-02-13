'use strict';
const Generator = require('yeoman-generator');
const sharedConfig = require('../shared-config');
const todo = require('../todo');

module.exports = Generator.extend({
  prompting: function () {
    return this.prompt(
      sharedConfig.promptsFor(this.config,
                              sharedConfig.primaryLanguagePrompt,
                              sharedConfig.runCommandPrompt)
    ).then(
      sharedConfig.saveResultsTo(this.config,
                                 sharedConfig.primaryLanguagePrompt,
                                 sharedConfig.runCommandPrompt)
    );
  },
  writing: function () {
    if (this.config.get('runCommand') === sharedConfig.runCommandPrompt.default) {
      todo.add(this.config, this.fs, {
        'Cloud.gov Manifests': ['Procfile\'s "run" command']
      });
    }
    this.fs.copyTpl(
        this.templatePath(this.config.get('primaryLanguage') + '/*'),
        this.destinationPath(),
        {runCommand: this.config.get('runCommand')}
    );
  }
});
