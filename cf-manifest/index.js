const Generator = require('yeoman-generator');
const allPrompts = require('../app/prompts');
const { onlyNewPrompts, saveUpdatedPrompts } = require('../app/prompts/utils');
const todo = require('../todo');

const serviceCreation = {
  database: 'create-service aws-rds medium-psql database',
  secrets: 'create-user-provided-service credentials -p \'{"my": "secret"}\'',
};

const prompts = [
  allPrompts.repoName,
  allPrompts.primaryLanguage,
  allPrompts.runCommand,
  allPrompts.cloudGovServices,
];

module.exports = class extends Generator {
  prompting() {
    return this.prompt(onlyNewPrompts(this.config, prompts))
      .then(saveUpdatedPrompts(this.config, prompts));
  }

  writing() {
    if (this.config.get('runCommand') === prompts.runCommand.default) {
      todo.add(this.config, this.fs, {
        'Cloud.gov Manifests': ['Procfile\'s "run" command'],
      });
    }
    const serviceTodos = this.config.get('cloudGovServices').map(service =>
        `Run \`cf ${serviceCreation[service]}\` in each env`);
    if (serviceTodos.length > 0) {
      todo.add(this.config, this.fs, { 'Cloud.gov Manifests': serviceTodos });
    }

    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationPath(),
      this.config.getAll(),
    );
  }
};
