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

      this.newrelic_config = function (manifest_body, language) {
        if (language == "Python") {
          if (manifest_body.indexOf("NEW_RELIC_CONFIG_FILE:") < 0) {
              return '\n    NEW_RELIC_CONFIG_FILE: newrelic.ini';
            }
        }
        if (language == "Ruby") {
         if (manifest_body.indexOf("NEW_RELIC_CONFIG_FILE:") < 0) {
              return '\n    NEW_RELIC_CONFIG_FILE: newrelic.yml';
          } 
        }
        if (language == "Javascript") {
         if (manifest_body.indexOf("NEW_RELIC_CONFIG_FILE:") < 0) {
              return '\n    NEW_RELIC_CONFIG_FILE: newrelic.js';
          } 
        }
      }

      // choices are dev, production
      this.writing_to_manifest = function (environment, language) {
        var cwd = process.cwd();
        var manifest = 'manifest_'+environment+'.yml';
        if (fs.existsSync(manifest)) {
          //var manifest_body = this.readFileAsString(manifest);
          var manifest_body = fs.readFileSync(manifest, 'utf8');
          if (manifest_body.indexOf('applications:') < 0) {
            manifest_body += '\napplications:\n';
          if (manifest_body.indexOf('env:') < 0) {
              manifest_body += '  env:\n';
            }
          }
        if (manifest_body.indexOf("NEW_RELIC_APP_NAME:") < 0) {
            manifest_body += '\n    NEW_RELIC_APP_NAME: ' + this.projectFullName + ' ('+environment+')';
          }
        manifest_body += this.newrelic_config(manifest_body, language);
        if (manifest_body.indexOf("NEW_RELIC_ENV:") < 0) {
            manifest_body += '\n    NEW_RELIC_ENV: "'+environment+'"';
          }
        if (manifest_body.indexOf("NEW_RELIC_LOG:") < 0) {
            manifest_body += '\n    NEW_RELIC_LOG: "stdout"';
          }
        fs.writeFile(manifest, manifest_body, function (err) {
            if (err) throw err;
          });
        } else {
         this.log("Please run yo 18f:cf-manifest first");
        }
      };
      
      this.writing_to_requirements_txt = function () {
        var cwd = process.cwd();
        var requirements_file = 'requirements.txt';
        if (fs.existsSync(requirements_file)) {
          //var manifest_body = this.readFileAsString(manifest);
          var requirements_body = fs.readFileSync(requirements_file, 'utf8');
          requirements_body += "\nnewrelic\n"
          fs.writeFile(requirements_file, requirements_body, function (err) {
            if (err) throw err;
          });
        } else {
          this.log("Please create requirements.txt first");
        }
      };

      this.writing_to_packages_json = function () {
        var cwd = process.cwd();
        var package_json = 'package.json';
        if (fs.existsSync(package_json)) {
          //var manifest_body = this.readFileAsString(manifest);
          var package_body = fs.readFileSync(package_json, 'utf8');  
          var json_package_obj = JSON.parse(package_body);
          json_package_obj["dependencies"]["newrelic"] = "latest";
          package_body = JSON.stringify(json_package_obj);
          fs.writeFile(package_json, package_body, function (err) {
            if (err) throw err;
          });
        } else {
          this.log("Please create requirements.txt first");
        }
      };

      this.writing_to_gemfile = function () {
        var cwd = process.cwd();
        var gemfile = 'Gemfile';
        if (fs.existsSync(gemfile)) {
          //var manifest_body = this.readFileAsString(manifest);
          var gembody = fs.readFileSync(gemfile, 'utf8');
          if ( gembody.indexOf("source 'https://rubygems.org'") < 0) {
            gembody += "source 'https://rubygems.org'";
          }
          gembody += "\ngem 'newrelic_rpm'\n"
          fs.writeFile(gemfile, gembody, function (err) {
            if (err) throw err;
          });
          this.log("Don't forget to run bundle install!");
        } else {
          this.log("Please create Gemfile first");
        }
      }  
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
        value: 'Python',
        checked: false
      },{
        name: 'Rails',
        value: 'Ruby',
        checked: false
      },{
        name: 'Node.js',
        value: 'Javascript',
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
    if (this.config.get('projectBackendLanguage') === 'Python') {
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
        this.writing_to_requirements_txt();
      }).catch(this.env.error.bind(this.env));
    }
    if (this.config.get('projectBackendLanguage') === 'Ruby') {
      return axios.get(
        'https://raw.githubusercontent.com/EricSchles/new-relic/master/ruby-low-security.yml')
      .then((response) => {
        // Not EJS style, so we'll just search-and-replace
        // generate the newrelic.ini file
        const content = response.data.replace(
            '[Project Name]', this.config.get('projectFullName'));
        this.fs.write(this.destinationPath('newrelic.yml'), content);
        // update manifest_dev.yml
        this.writing_to_manifest('dev');
        // update manifest_prod.yml
        this.writing_to_manifest('prod');
        this.writing_to_gemfile();
      }).catch(this.env.error.bind(this.env));
    }
    if (this.config.get('projectBackendLanguage') === 'Javascript') {
      return axios.get(
        'https://raw.githubusercontent.com/EricSchles/new-relic/master/javascript-low-security.yml')
      .then((response) => {
        // Not EJS style, so we'll just search-and-replace
        // generate the newrelic.ini file
        const content = response.data.replace(
            '[Project Name]', this.config.get('projectFullName'));
        this.fs.write(this.destinationPath('newrelic.js'), content);
        // update manifest_dev.yml
        this.writing_to_manifest('dev');
        // update manifest_prod.yml
        this.writing_to_manifest('prod');
        this.writing_to_packages_json();
      }).catch(this.env.error.bind(this.env));
    }

}


};