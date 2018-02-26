const axios = require('axios');

const allPrompts = require('../app/prompts');
const BaseGenerator = require('../app/base-generator');


module.exports = class extends BaseGenerator {
  constructor(args, options) {
    super(args, options);
    this.prompts = [allPrompts.projectFullName];
  }

  prompting() {
    return this.askAndSavePrompts();
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
