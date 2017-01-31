'use strict';
var axios = require('axios');
var Generator = require('yeoman-generator');
var languages = require('../languages');

function fetchGitignore(language, fs, gitignorePath) {
  var url = 'https://raw.githubusercontent.com/github/gitignore/master/';
  url += language + '.gitignore';

  return axios.get(url).then(function (response) {
    var fileContents = fs.read(gitignorePath, {defaults: ''});
    fileContents += '\n\n# === ' + language + ' ===\n' + response.data;
    fs.write(gitignorePath, fileContents);
  });
};

module.exports = Generator.extend({
  prompting: function () {
    return this.prompt(languages.promptFor(this.config)).then(
        languages.saveResultsTo(this.config));
  },
  languagesAlreadyPresent: function() {
    var languages = new Set();
    var filePath = this.destinationPath('.gitignore');
    var fileContents = this.fs.read(filePath, {defaults: ''});
    var search = /^# === ([^=]+) ===$/gm;
    var match = search.exec(fileContents);

    while (match !== null) {
      languages.add(match[1]);
      match = search.exec(fileContents);
    }
    return languages;
  },
  writing: function () {
    var existingLanguages = this.languagesAlreadyPresent();
    var requests = this.config.get('languages').filter(function(language) {
      return !existingLanguages.has(language);
    }).map(function(language) {
      return fetchGitignore(
        language, this.fs, this.destinationPath('.gitignore')
      );
    }.bind(this));
    return Promise.all(requests);
  }
});

