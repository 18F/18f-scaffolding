'use strict';
var Generator = require('yeoman-generator');
var sharedConfig = require('../shared-config');
var todo = require('../todo');

module.exports = Generator.extend({
  prompting: function () {
    return this.prompt(
      sharedConfig.promptsFor(this.config, sharedConfig.primaryLanguagePrompt)
    ).then(
      sharedConfig.saveResultsTo(this.config, sharedConfig.primaryLanguagePrompt)
    );
  },
  writing: function () {
    todo.add(this.config, this.fs, {
      'Cloud.gov Manifests': ['Procfile\'s "run" command']
    });
    this.fs.copy(
        this.templatePath(this.config.get('primaryLanguage') + '/*'),
        this.destinationPath()
    );
  }
});
