const jsyaml = require('js-yaml');

const allPrompts = require('../app/prompts');
const BaseGenerator = require('../app/base-generator');


module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.prompts = [
      allPrompts.repoName,
      allPrompts.primaryLanguage,
      allPrompts.languages,
    ];
  }

  // choices are dev, production
  _writeToManifest(environment) {
    const manifest = `manifest_${environment}.yml`;
    let manifestBody;
    if (this.fs.exists(manifest)) {
      manifestBody = this.fs.read(manifest, 'utf8');
      const doc = jsyaml.safeLoad(manifestBody);
      if (!Object.keys(doc).includes('applications')) {
        doc.applications = {};
      }
      doc.applications.env = doc.applications.env || [];
      const fileByLang = {
        Python: 'newrelic.ini',
        Ruby: 'newrelic.yml',
        Node: 'newrelic.js',
      };
      const primaryLang = this.config.get('primaryLanguage');
      if (Object.keys(fileByLang).includes(primaryLang)) {
        doc.applications.env.push({
          NEW_RELIC_APP_NAME: `${this.config.get('repoName')} (${environment})`,
          NEW_RELIC_CONFIG_FILE: fileByLang[primaryLang],
          NEW_RELIC_ENV: environment,   // note that we don't need the string template
          NEW_RELIC_LOG: 'stdout',
        });
      }
      this.fs.write(manifest, jsyaml.safeDump(doc));
    } else {
      this.log('Please run yo 18f:cf-manifest first');
    }
  }

  _writeToRequirementsTxt() {
    const requirementsFile = 'requirements.txt';
    if (this.fs.exists(requirementsFile)) {
      let requirementsBody = this.fs.read(requirementsFile, 'utf8');
      if (requirementsBody.indexOf('newrelic') < 0) {
        requirementsBody += '\nnewrelic\n';
        this.fs.write(requirementsFile, requirementsBody);
      }
    } else {
      this.log('Please create requirements.txt first');
    }
  }

  _writeToPackagesJson() {
    const packageJson = 'package.json';
    if (this.fs.exists(packageJson)) {
      const packageObj = this.fs.readJSON(packageJson);
      const deps = packageObj.dependencies || {};
      if (!deps.newrelic) {
        deps.newrelic = 'latest';
        packageObj.dependencies = deps;
        this.fs.writeJSON(packageJson, packageObj);
      }
    } else {
      this.log('Please create package.json first');
    }
  }

  _writeToGemfile() {
    const gemfile = 'Gemfile';
    if (this.fs.exists(gemfile)) {
      let gembody = this.fs.read(gemfile, 'utf8');
      if (gembody.indexOf("source 'https://rubygems.org'") < 0) {
        gembody += "source 'https://rubygems.org'";
      }
      if (gembody.indexOf('newrelic_rpm') < 0) {
        gembody += "\ngem 'newrelic_rpm'\n";
        this.fs.append(gemfile, gembody, (err) => {
          if (err) throw err;
        });
      }
      this.log("Don't forget to run bundle install!");
    } else {
      this.log('Please create Gemfile first');
    }
  }

  prompting() {
    return this.askAndSavePrompts();
  }

  writing() {
    const languages = this.config.get('languages');
    const context = this.config.getAll();
    if (languages.includes('Python')) {
      this.fs.copyTpl(this.templatePath('python-low-security.ini'), this.destinationPath('newrelic.ini'), context);
      this._writeToRequirementsTxt();
    }
    if (languages.includes('Ruby')) {
      this.fs.copyTpl(this.templatePath('ruby-low-security.yml'), this.destinationPath('newrelic.yml'), context);
      this._writeToGemfile();
    }
    if (languages.includes('Node')) {
      this.fs.copyTpl(this.templatePath('javascript-low-security.js.template'), this.destinationPath('newrelic.js'), context);
      this._writeToPackagesJson();
    }
    // update manifest_dev.yml
    this._writeToManifest('dev');
    // update manifest_prod.yml
    this._writeToManifest('prod');
  }
};
