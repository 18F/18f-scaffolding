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

  constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts)

      // choices are dev, production
      this.writing_to_manifest = function (environment) {
        var cwd = process.cwd();
        var manifest = 'manifest_'+environment+'.yml';
        var environment = 'production';
        if (fs.existsSync(manifest)) {
          //var manifest_body = this.readFileAsString(manifest);
          var manifest_body = fs.readFileSync(manifest, 'utf8');
          if (manifest_body.indexOf('applications:') < 0) {
            manifest_body += '\napplications:\n';
          if (manifest_body.indexOf('env:') < 0) {
            manifest_body += '\n  env:\n';
          }
        }
        if (manifest_body.indexOf("NEW_RELIC_APP_NAME:") < 0) {
          manifest_body += '\n\tNEW_RELIC_APP_NAME: ' + this.projectFullName + ' ('+environment+')';
        }
        if (manifest_body.indexOf("NEW_RELIC_CONFIG_FILE:") < 0) {
          manifest_body += '\n\tNEW_RELIC_CONFIG_FILE: newrelic.ini';
        }
        if (manifest_body.indexOf("NEW_RELIC_ENV:") < 0) {
          manifest_body += '\n\tNEW_RELIC_ENV: "'+environment+'"';
        }
        if (manifest_body.indexOf("NEW_RELIC_LOG:") < 0) {
          manifest_body += '\n\t NEW_RELIC_LOG: "stdout"';
        }
        fs.writeFile(manifest, manifest_body, function (err) {
          if (err) throw err;
        });
      } else {
        this.log("Please run yo 18f:cf-manifest first");
      }
    };
  }
  
  
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
        // update manifest_dev.yml
        this.writing_to_manifest('dev');
        // update manifest_prod.yml
        this.writing_to_manifest('prod');
      }).catch(this.env.error.bind(this.env));
  }
}


};