const axios = require('axios');
const Generator = require('yeoman-generator');
const jsyaml = require('js-yaml');
const fs = require('fs');
const sharedConfig = require('../shared-config');


module.exports = class extends Generator {


  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // choices are dev, production
    this.writeToManifest = function (environment) {
      const manifest = `manifest_${environment}.yml`;
      let manifestBody;
      if (this.fs.exists(manifest)) {
        manifestBody = this.fs.read(manifest, 'utf8');
        const doc = jsyaml.safeLoad(manifestBody);
        if (Object.keys(doc).indexOf('applications') < 0) {
          doc.applications = { env: [] };
        }
        if (Object.keys(doc).indexOf('env') < 0) {
          doc.applications.env = [];
        }
        if (this.config.get('primaryLanguage') === 'Python') {
          if (!Array.isArray(doc.applications.env)) {
            doc.applications.env = [];
          }
          doc.applications.env.push({
            NEW_RELIC_APP_NAME: `${this.config.get('repoName')} (${environment})`,
            NEW_RELIC_CONFIG_FILE: 'newrelic.ini',
            NEW_RELIC_ENV: `${environment}`,
            NEW_RELIC_LOG: 'stdout',
          });
        }
        if (this.config.get('primaryLanguage') === 'Ruby') {
          if (!Array.isArray(doc.applications.env)) {
            doc.applications.env = [];
          }
          doc.applications.env.push({
            NEW_RELIC_APP_NAME: `${this.config.get('repoName')} (${environment})`,
            NEW_RELIC_CONFIG_FILE: 'newrelic.yml',
            NEW_RELIC_ENV: `${environment}`,
            NEW_RELIC_LOG: 'stdout',
          });
        }
        if (this.config.get('primaryLanguage') === 'Javascript') {
          if (!Array.isArray(doc.applications.env)) {
            doc.applications.env = [];
          }
          doc.applications.env.push({
            NEW_RELIC_APP_NAME: `${this.config.get('repoName')} (${environment})`,
            NEW_RELIC_CONFIG_FILE: 'newrelic.js',
            NEW_RELIC_ENV: `${environment}`,
            NEW_RELIC_LOG: 'stdout',
          });
        }
        this.fs.append(manifest, jsyaml.safeDump(doc));
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
    const prompts = sharedConfig.promptsFor(
      this.config,
      sharedConfig.repoNamePrompt,
      sharedConfig.primaryLanguagePrompt,
      sharedConfig.languagesPrompt);
    return this.prompt(prompts).then((props) => {
      sharedConfig.saveResultsTo(this.config,
                                 sharedConfig.repoNamePrompt,
                                 sharedConfig.primaryLanguagePrompt,
                                 sharedConfig.languagesPrompt)(props);
    });
  }

  writing() {
    let result;
    const languages = this.config.get('languages');
    const context = Object.assign({ repoName: this.config.get('repoName') }, this.config.getAll());
    if (languages.indexOf('Python') > -1) {
      this.fs.copyTpl(this.templatePath('python-low-security.ini'), this.destinationPath('newrelic.ini'), context);
      // update manifest_dev.yml
      this.writeToManifest('dev');
      // update manifest_prod.yml
      this.writeToManifest('prod');
      this.writeToRequirements_txt();
    
    }
    if (languages.indexOf('Ruby') > -1) {
      this.fs.copyTpl(this.templatePath('ruby-low-security.yml'), this.destinationPath('newrelic.yml'), this.config.get('repoName'))  
      // update manifest_dev.yml
      this.writeToManifest('dev');
      // update manifest_prod.yml
      this.writeToManifest('prod');
      this.writeToGemfile();
    
    }
    if (languages.indexOf('Javascript') > -1) {
      this.fs.copyTpl(this.templatePath('javascript-low-security.js'), this.destinationPath('newrelic.js'), this.config.get('repoName'))    
      // update manifest_dev.yml
      this.writeToManifest('dev');
      // update manifest_prod.yml
      this.writeToManifest('prod');
      this.writeToPackages_json();
  
    }
  }
};
