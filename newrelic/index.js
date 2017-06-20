const axios = require('axios');
const Generator = require('yeoman-generator');
var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');

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
    if (!this.config.get('projectBackendLanguage')) {
      prompts.push({
        type: 'checkbox',
        name: 'projectBackendLanguage',
        message: 'What backend language is the project using?',
        choices: [{
        name: 'Django',
        value: 'pythonLanguage',
        checked: false
      },{
        name: 'Rails',
        value: 'rubyLanguage',
        checked: false
      },{
        name: 'Node.js',
        value: 'javascriptLanguage',
        checked: false
      }]
      });
    }

    return this.prompt(prompts).then((props) => {
      if (props.projectFullName) {
        this.config.set('projectFullName', props.projectFullName);
      }
      if (props.projectBackendLanguage) {
        this.config.set('projectBackendLanguage', props.projectBackendLanguage[0]);
      }
    });
  }

  writing() {
    if (this.config.get('projectBackendLanguage') === 'pythonLanguage') {
      return axios.get(
        'https://raw.githubusercontent.com/EricSchles/new-relic/master/python-low-security.ini')
      .then((response) => {
        // Not EJS style, so we'll just search-and-replace
        const content = response.data.replace(
            '[Project Name]', this.config.get('projectFullName'));
        this.fs.write(this.destinationPath('newrelic.ini'), content);
      }).catch(this.env.error.bind(this.env));
  }
}
};