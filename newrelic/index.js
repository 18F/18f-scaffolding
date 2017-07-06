const axios = require('axios');
const Generator = require('yeoman-generator');
const fs = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // choices are dev, production
    this.write_to_manifest = function (environment, language) {
      const manifest = `manifest_${environment}.yml`;
      let manifestBody;
      if (fs.existsSync(manifest)) {
        manifestBody = fs.readFileSync(manifest, 'utf8');
        if (manifestBody.indexOf('applications:') < 0) {
          manifestBody += '\napplications:\n';
          if (manifestBody.indexOf('env:') < 0) {
            manifestBody += '  env:\n';
          }
        }
        if (manifestBody.indexOf('NEW_RELIC_APP_NAME:') < 0) {
          manifestBody += `\n    NEW_RELIC_APP_NAME: ${this.projectFullName} (${environment})`;
        }
        manifestBody += this.newrelic_config(manifestBody, language);
        if (manifestBody.indexOf('NEW_RELIC_ENV:') < 0) {
          manifestBody += `\n    NEW_RELIC_ENV: "${environment}"`;
        }
        if (manifestBody.indexOf('NEW_RELIC_LOG:') < 0) {
          manifestBody += '\n    NEW_RELIC_LOG: "stdout"';
        }
        fs.writeFile(manifest, manifestBody, (err) => {
          if (err) throw err;
        });
      } else {
        this.log('Please run yo 18f:cf-manifest first');
      }
    };

    this.write_to_requirements_txt = function () {
      const requirementsFile = 'requirements.txt';
      if (fs.existsSync(requirementsFile)) {
        let requirementsBody = fs.readFileSync(requirementsFile, 'utf8');
        requirementsBody += '\nnewrelic\n';
        fs.writeFile(requirementsFile, requirementsBody, (err) => {
          if (err) throw err;
        });
      } else {
        this.log('Please create requirements.txt first');
      }
    };

    this.write_to_packages_json = function () {
      const packageJson = 'package.json';
      if (fs.existsSync(packageJson)) {
        let packageBody = fs.readFileSync(packageJson, 'utf8');
        const jsonPackageObj = JSON.parse(packageBody);
        jsonPackageObj.dependencies.newrelic = 'latest';
        packageBody = JSON.stringify(jsonPackageObj);
        fs.writeFile(packageJson, packageBody, (err) => {
          if (err) throw err;
        });
      } else {
        this.log('Please create package.json first');
      }
    };

    this.write_to_gemfile = function () {
      const gemfile = 'Gemfile';
      if (fs.existsSync(gemfile)) {
        let gembody = fs.readFileSync(gemfile, 'utf8');
        if (gembody.indexOf("source 'https://rubygems.org'") < 0) {
          gembody += "source 'https://rubygems.org'";
        }
        gembody += "\ngem 'newrelic_rpm'\n";
        fs.writeFile(gemfile, gembody, (err) => {
          if (err) throw err;
        });
        this.log("Don't forget to run bundle install!");
      } else {
        this.log('Please create Gemfile first');
      }
    };
  }

  newrelic_config(manifestBody, language) {
      let newrelicFile = '';
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
    };

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
          checked: false,
        }, {
          name: 'Rails',
          value: 'Ruby',
          checked: false,
        }, {
          name: 'Node.js',
          value: 'Javascript',
          checked: false,
        }],
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
    let result;
    if (this.config.get('projectBackendLanguage') === 'Python') {
      result = axios.get(
        'https://raw.githubusercontent.com/18F/18f-cli/ericschles-newrelic-subgenerator/newrelic/templates/python-low-security.ini')
        .then((response) => {
        // Not EJS style, so we'll just search-and-replace
        // generate the newrelic.ini file
          let content = response.data.replace(
            '[Project Name]', this.config.get('projectFullName'));
          while (content.indexOf('[Project Name') > 0) {
            content = content.replace('[Project Name]', this.config.get('projectFullName'));
          }
          this.fs.write(this.destinationPath('newrelic.ini'), content);
          // update manifest_dev.yml
          this.write_to_manifest('dev');
          // update manifest_prod.yml
          this.write_to_manifest('prod');
          this.write_to_requirements_txt();
        }).catch(this.env.error.bind(this.env));
    }
    if (this.config.get('projectBackendLanguage') === 'Ruby') {
      result = axios.get(
        'https://raw.githubusercontent.com/18F/18f-cli/ericschles-newrelic-subgenerator/newrelic/templates/ruby-low-security.yml')
        .then((response) => {
        // Not EJS style, so we'll just search-and-replace
        // generate the newrelic.ini file
          let content = response.data.replace(
            '[Project Name]', this.config.get('projectFullName'));
          while (content.indexOf('[Project Name') > 0) {
            content = content.replace('[Project Name]', this.config.get('projectFullName'));
          }
          this.fs.write(this.destinationPath('newrelic.yml'), content);
          // update manifest_dev.yml
          this.write_to_manifest('dev');
          // update manifest_prod.yml
          this.write_to_manifest('prod');
          this.write_to_gemfile();
        }).catch(this.env.error.bind(this.env));
    }
    if (this.config.get('projectBackendLanguage') === 'Javascript') {
      result = axios.get(
        'https://raw.githubusercontent.com/18F/18f-cli/ericschles-newrelic-subgenerator/newrelic/templates/javascript-low-security.js')
        .then((response) => {
        // Not EJS style, so we'll just search-and-replace
        // generate the newrelic.ini file
          let content = response.data.replace(
            '[Project Name]', this.config.get('projectFullName'));
          while (content.indexOf('[Project Name') > 0) {
            content = content.replace('[Project Name]', this.config.get('projectFullName'));
          }
          this.fs.write(this.destinationPath('newrelic.js'), content);
          // update manifest_dev.yml
          this.write_to_manifest('dev');
          // update manifest_prod.yml
          this.write_to_manifest('prod');
          this.write_to_packages_json();
        }).catch(this.env.error.bind(this.env));
    }
    return result;
  }
};
