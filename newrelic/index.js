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
        // generate the newrelic.ini file
        const content = response.data.replace(
            '[Project Name]', this.config.get('projectFullName'));
        this.fs.write(this.destinationPath('newrelic.ini'), content);
        // update the manifest_dev.yml file
        var cwd = process.cwd();
        var manifest_dev = 'manifest_dev.yml';
        if (fs.existsSync(manifest_dev)) {
          var manifest_dev_body = this.readFileAsString(manifest_dev);
          if (manifest_dev_body.indexOf('applications:') < 0) {
            manifest_dev_body += '\napplications:\n';
          if (manifest_dev_body.indexOf('env:') < 0) {
            manifest_dev_body += '\n  env:\n';
          }
        }
        if (manifest_dev_body.indexOf("NEW_RELIC_APP_NAME:") < 0) {
          manifest_dev_body += '\n\tNEW_RELIC_APP_NAME: ' + this.projectFullName + ' (dev)';
        }
        if (manifest_dev_body.indexOf("NEW_RELIC_CONFIG_FILE:") < 0) {
          manifest_dev_body += '\n\tNEW_RELIC_CONFIG_FILE: newrelic.ini';
        }
        if (manifest_dev_body.indexOf("NEW_RELIC_ENV:") < 0) {
          manifest_dev_body += '\n\tNEW_RELIC_ENV: "dev"';
        }
        if (manifest_dev_body.indexOf("NEW_RELIC_LOG:") < 0) {
          manifest_dev_body += '\n\t NEW_RELIC_LOG: "stdout"';
        }
        fs.writeFile(manifest_dev, manifest_dev_body, function (err) {
          if (err) throw err;
        });
      } else {
        this.log("Please run yo 18f:cf-manifest first");
      }
      }).catch(this.env.error.bind(this.env));
  }
}


};