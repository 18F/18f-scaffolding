const Generator = require('yeoman-generator');
const sharedConfig = require('../shared-config');
const todo = require('../todo');

const serviceCreation = {
  database: 'create-service aws-rds medium-psql database',
  'secret credentials': 'create-user-provided-service credentials -p \'{"my": "secret"}\'',
};

const servicesPrompt = {
  type: 'checkbox',
  name: 'cloudGovServices',
  message: 'Will this project need any of these services?',
  choices: Object.keys(serviceCreation),
};

module.exports = class extends Generator {
  prompting() {
    const prompts = sharedConfig.promptsFor(
      this.config,
      sharedConfig.repoNamePrompt,
      sharedConfig.primaryLanguagePrompt,
      sharedConfig.runCommandPrompt);
    prompts.push(servicesPrompt);
    return this.prompt(prompts).then((props) => {
      sharedConfig.saveResultsTo(this.config,
                                 sharedConfig.repoNamePrompt,
                                 sharedConfig.primaryLanguagePrompt,
                                 sharedConfig.runCommandPrompt)(props);
      this.cloudGovServices = props.cloudGovServices;
    });
  }

  writing() {
    if (this.config.get('runCommand') === sharedConfig.runCommandPrompt.default) {
      todo.add(this.config, this.fs, {
        'Cloud.gov Manifests': ['Procfile\'s "run" command'],
      });
    }
    const serviceTodos = this.cloudGovServices.map(service =>
        `Run \`cf ${serviceCreation[service]}\` in each env`);
    if (serviceTodos.length > 0) {
      todo.add(this.config, this.fs, { 'Cloud.gov Manifests': serviceTodos });
    }
    const context = Object.assign({ cloudGovServices: this.cloudGovServices },
                                  this.config.getAll());

    this.fs.copyTpl(this.templatePath('**'), this.destinationPath(), context);
  }
};
