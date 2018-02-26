const allPrompts = require('../app/prompts');
const BaseGenerator = require('../app/base-generator');

const serviceCreation = {
  database: 'create-service aws-rds medium-psql database',
  secrets: 'create-user-provided-service credentials -p \'{"my": "secret"}\'',
};


module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.prompts = [
      allPrompts.repoName,
      allPrompts.primaryLanguage,
      allPrompts.runCommand,
      allPrompts.cloudGovServices,
    ];
  }

  prompting() {
    return this.askAndSavePrompts();
  }

  writing() {
    if (this.config.get('runCommand') === allPrompts.runCommand.default) {
      this.addTodos({ 'Cloud.gov Manifests': ['Procfile\'s "run" command'] });
    }
    const serviceTodos = this.config.get('cloudGovServices').map(service =>
        `Run \`cf ${serviceCreation[service]}\` in each env`);
    if (serviceTodos.length > 0) {
      this.addTodos({ 'Cloud.gov Manifests': serviceTodos });
    }

    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationPath(),
      this.config.getAll(),
    );
  }
};
