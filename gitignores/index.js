const axios = require('axios');
const Generator = require('yeoman-generator');
const sharedConfig = require('../shared-config');

function fetchAndWriteGitignore(language, fs, gitignorePath, logError) {
  const url = `https://raw.githubusercontent.com/github/gitignore/master/${language}.gitignore`;

  return axios.get(url).then((response) => {
    let fileContents = fs.read(gitignorePath, { defaults: '' });
    fileContents += `\n\n# === ${language} ===\n${response.data}`;
    fs.write(gitignorePath, fileContents);
  }).catch(logError);
}

function languagesAlreadyPresent(filePath, fs) {
  const languages = new Set();
  const fileContents = fs.read(filePath, { defaults: '' });
  const search = /^# === ([^=]+) ===$/gm;
  let match = search.exec(fileContents);

  while (match !== null) {
    languages.add(match[1]);
    match = search.exec(fileContents);
  }
  return languages;
}

module.exports = class extends Generator {
  prompting() {
    return this.prompt(
        sharedConfig.promptsFor(this.config, sharedConfig.languagesPrompt))
      .then(
        sharedConfig.saveResultsTo(this.config, sharedConfig.languagesPrompt));
  }

  writing() {
    const filePath = this.destinationPath('.gitignore');
    const existingLanguages = languagesAlreadyPresent(filePath, this.fs);
    const requests = this.config.get('languages')
      .filter(language => !existingLanguages.has(language))
      .map(language => fetchAndWriteGitignore(
        language, this.fs, this.destinationPath('.gitignore'),
        this.env.error.bind(this.env)));
    return Promise.all(requests);
  }
};

