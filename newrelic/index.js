const axios = require('axios');
const Generator = require('yeoman-generator');
const fs = require('fs');

module.exports = class extends Generator {

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)

    this.newrelic_config = function (manifestBody, language) {
        var newrelicFile = '';
        if (language === 'Python') {
          if (manifestBody.indexOf('NEW_RELIC_CONFIG_FILE:') < 0) {
              newrelicFile = '\n    NEW_RELIC_CONFIG_FILE: newrelic.ini';
            }
        }
        if (language === 'Ruby') {
         if (manifestBody.indexOf('NEW_RELIC_CONFIG_FILE:') < 0) {
              newrelicFile = '\n    NEW_RELIC_CONFIG_FILE: newrelic.yml';
          } 
        }
        if (language === 'Javascript') {
         if (manifestBody.indexOf('NEW_RELIC_CONFIG_FILE:') < 0) {
              newrelicFile = '\n    NEW_RELIC_CONFIG_FILE: newrelic.js';
          } 
        }
        return newrelicFile;
      }

      // choices are dev, production
      this.writing_to_manifest = function (environment, language) {
        var cwd = process.cwd();
        var manifest = 'manifest_'+environment+'.yml';
        if (fs.existsSync(manifest)) {
          //var manifest_body = this.readFileAsString(manifest);
          var manifestBody = fs.readFileSync(manifest, 'utf8');
          if (manifestBody.indexOf('applications:') < 0) {
            manifestBody += '\napplications:\n';
          if (manifestBody.indexOf('env:') < 0) {
              manifestBody += '  env:\n';
            }
          }
        if (manifestBody.indexOf('NEW_RELIC_APP_NAME:') < 0) {
            manifestBody += '\n    NEW_RELIC_APP_NAME: ' + this.projectFullName + ' ('+environment+')';
          }
        manifestBody += this.newrelic_config(manifest_body, language);
        if (manifestBody.indexOf('NEW_RELIC_ENV:') < 0) {
            manifestBody += '\n    NEW_RELIC_ENV: "'+environment+'"';
          }
        if (manifestBody.indexOf('NEW_RELIC_LOG:') < 0) {
            manifestBody += '\n    NEW_RELIC_LOG: "stdout"';
          }
        fs.writeFile(manifest, manifestBody, function (err) {
            if (err) throw err;
          });
        } else {
         this.log('Please run yo 18f:cf-manifest first');
        }
      };
      
      this.writing_to_requirements_txt = function () {
        var cwd = process.cwd();
        var requirementsFile = 'requirements.txt';
        if (fs.existsSync(requirementsFile)) {
          //var manifest_body = this.readFileAsString(manifest);
          var requirementsBody = fs.readFileSync(requirementsFile, 'utf8');
          requirementsBody += '\nnewrelic\n';
          fs.writeFile(requirementsFile, requirementsBody, function (err) {
            if (err) throw err;
          });
        } else {
          this.log('Please create requirements.txt first');
        }
      };

      this.writing_to_packages_json = function () {
        var cwd = process.cwd();
        var packageJson = 'package.json';
        if (fs.existsSync(packageJson)) {
          //var manifest_body = this.readFileAsString(manifest);
          var packageBody = fs.readFileSync(packageJson, 'utf8');  
          var jsonPackageObj = JSON.parse(packageBody);
          jsonPackageObj['dependencies']['newrelic'] = 'latest';
          packageBody = JSON.stringify(jsonPackageObj);
          fs.writeFile(packageJson, packageBody, function (err) {
            if (err) throw err;
          });
        } else {
          this.log('Please create package.json first');
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
          gembody += '\ngem 'newrelic_rpm'\n';
          fs.writeFile(gemfile, gembody, function (err) {
            if (err) throw err;
          });
          this.log("Don't forget to run bundle install!");
        } else {
          this.log('Please create Gemfile first');
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
        'https://raw.githubusercontent.com/EricSchles/new-relic/master/javascript-low-security.js')
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