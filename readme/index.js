'use strict';
var axios = require('axios');
var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  prompting: function () {
    var prompts = [];
    if (!this.config.get('projectFullName')) {
      prompts.push({
        type: 'input',
        name: 'projectFullName',
        message: 'What is the project\'s full name?'
      });
    }
    
    return this.prompt(prompts).then(function (props) {
      if (props.projectFullName) {
        this.config.set('projectFullName', props.projectFullName);
      }
    }.bind(this));
  },
  writing: function () {
    return axios.get(
      'https://raw.githubusercontent.com/18F/open-source-policy/master/README_TEMPLATE.md'
    ).then(function (response) {
      // Not EJS style, so we'll just search-and-replace
      var content = response.data.replace(
          '[Repo Name]', this.config.get('projectFullName'));
      this.fs.write(this.destinationPath('README.md'), content);
    }.bind(this));
  }
});

