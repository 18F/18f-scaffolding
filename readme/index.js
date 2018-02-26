const axios = require('axios');
const Generator = require('yeoman-generator');

const allPrompts = require('../app/prompts');
const { onlyNewPrompts, saveUpdatedPrompts } = require('../app/prompts/utils');

const prompts = [allPrompts.projectFullName];

module.exports = class extends Generator {
  prompting() {
    return this.prompt(onlyNewPrompts(this.config, prompts))
      .then(saveUpdatedPrompts(this.config, prompts));
  }

  writing() {
    return axios.get(
      'https://raw.githubusercontent.com/18F/open-source-policy/master/README_TEMPLATE.md')
    .then((response) => {
      // Not EJS style, so we'll just search-and-replace
      const content = response.data.replace(
          '[Repo Name]', this.config.get('projectFullName'));
      this.fs.write(this.destinationPath('README.md'), content);
    }).catch(this.env.error.bind(this.env));
  }
};
