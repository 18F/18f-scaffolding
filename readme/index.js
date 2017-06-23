const axios = require('axios');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {

  
  prompting() {
    const prompts = [];
    if (!this.config.get('projectFullName')) {
      prompts.push({
        type: 'input',
        name: 'projectFullName',
        message: 'What is the project\'s full name?',
      });
    }

    return this.prompt(prompts).then((props) => {
      if (props.projectFullName) {
        this.config.set('projectFullName', props.projectFullName);
      }
    });
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
