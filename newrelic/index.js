const axios = require('axios');
const Generator = require('yeoman-generator');
const jsyaml = require('js-yaml');
const fs = require('fs');


module.exports = class extends Generator {


  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // choices are dev, production
    this.writeToManifest = function (environment, language) {
      const manifest = `manifest_${environment}.yml`;
      let manifestBody;
      if (this.fs.exists(manifest)) {
        manifestBody = this.fs.read(manifest, 'utf8');
        const doc = jsyaml.load(manifestBody);
        if (manifestBody.indexOf('applications:') > 0) {
          if (manifestBody.indexOf('env:') > 0) {
            if (language === 'Python') {
              doc.applications.env.push({
                NEW_RELIC_APP_NAME: `${this.config.get('projectFullName')} (\${environment})`,
                NEW_RELIC_CONFIG_FILE: 'newrelic.ini',
                NEW_RELIC_ENV: `${environment}`,
                NEW_RELIC_LOG: 'stdout',
              });
            }
            if (language === 'Ruby') {
              doc.applications.env.push({
                NEW_RELIC_APP_NAME: `${this.config.get('projectFullName')} (\${environment})`,
                NEW_RELIC_CONFIG_FILE: 'newrelic.yml',
                NEW_RELIC_ENV: `${environment}`,
                NEW_RELIC_LOG: 'stdout',
              });
            }
            if (language === 'Javascript') {
              doc.applications.env.push({
                NEW_RELIC_APP_NAME: `${this.config.get('projectFullName')} (\${environment})`,
                NEW_RELIC_CONFIG_FILE: 'newrelic.js',
                NEW_RELIC_ENV: `${environment}`,
                NEW_RELIC_LOG: 'stdout',
              });
            }
          }
          this.fs.append(manifest, jsyaml.safeDump(doc));
        }
      } else {
        this.log('Please run yo 18f:cf-manifest first');
      }
    };

    this.writeToRequirements_txt = function () {
      const requirementsFile = 'requirements.txt';
      if (this.fs.exists(requirementsFile)) {
        let requirementsBody = fs.read(requirementsFile, 'utf8');
        requirementsBody += '\nnewrelic\n';
        this.fs.write(requirementsFile, requirementsBody);
      } else {
        this.log('Please create requirements.txt first');
      }
    };

    this.writeToPackagesJson = function () {
      const packageJson = 'package.json';
      if (this.fs.exists(packageJson)) {
        let packageBody = fs.read(packageJson, 'utf8');
        const jsonPackageObj = JSON.parse(packageBody);
        jsonPackageObj.dependencies.newrelic = 'latest';
        packageBody = JSON.stringify(jsonPackageObj);
        this.fs.append(packageJson, packageBody);
      } else {
        this.log('Please create package.json first');
      }
    };

    this.writeToGemfile = function () {
      const gemfile = 'Gemfile';
      if (this.fs.exists(gemfile)) {
        let gembody = fs.read(gemfile, 'utf8');
        if (gembody.indexOf("source 'https://rubygems.org'") < 0) {
          gembody += "source 'https://rubygems.org'";
        }
        gembody += "\ngem 'newrelic_rpm'\n";
        this.fs.append(gemfile, gembody, (err) => {
          if (err) throw err;
        });
        this.log("Don't forget to run bundle install!");
      } else {
        this.log('Please create Gemfile first');
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
          this.writeToManifest('dev');
          // update manifest_prod.yml
          this.writeToManifest('prod');
          this.writeToRequirements_txt();
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
          this.writeToManifest('dev');
          // update manifest_prod.yml
          this.writeToManifest('prod');
          this.writeToGemfile();
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
          this.writeToManifest('dev');
          // update manifest_prod.yml
          this.writeToManifest('prod');
          this.writeToPackages_json();
        }).catch(this.env.error.bind(this.env));
    }
    return result;
  }
};
