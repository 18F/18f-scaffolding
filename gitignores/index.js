'use strict';
var axios = require('axios');
var Generator = require('yeoman-generator');
var sharedConfig = require('../shared-config');

function fetchAndWriteGitignore(language, fs, gitignorePath, logError) {
  var url = 'https://raw.githubusercontent.com/github/gitignore/master/';
  url += language + '.gitignore';

  return axios.get(url).then(function (response) {
    var fileContents = fs.read(gitignorePath, {defaults: ''});
    fileContents += '\n\n# === ' + language + ' ===\n' + response.data;
    fs.write(gitignorePath, fileContents);
  }).catch(logError);
};

function languagesAlreadyPresent(filePath, fs) {
  var languages = new Set();
  var fileContents = fs.read(filePath, {defaults: ''});
  var search = /^# === ([^=]+) ===$/gm;
  var match = search.exec(fileContents);

  while (match !== null) {
    languages.add(match[1]);
    match = search.exec(fileContents);
  }
  return languages;
}

module.exports = Generator.extend({
  prompting: function () {
    return this.prompt(
        sharedConfig.promptsFor(this.config, sharedConfig.languagesPrompt)
      ).then(
        sharedConfig.saveResultsTo(this.config, sharedConfig.languagesPrompt)
      );
  },
  writing: function () {
    var filePath = this.destinationPath('.gitignore');
    var existingLanguages = languagesAlreadyPresent(filePath, this.fs);
    var requests = this.config.get('languages').filter(function(language) {
      return !existingLanguages.has(language);
    }).map(function(language) {
      return fetchAndWriteGitignore(
        language, this.fs, this.destinationPath('.gitignore'),
        this.env.error.bind(this.env)
      );
    }.bind(this));
    return Promise.all(requests);
  }
});

