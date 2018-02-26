const allPrompts = require('../app/prompts');
const BaseGenerator = require('../app/base-generator');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.prompts = [
      allPrompts.repoName,
      allPrompts.description,
      allPrompts.frontendDeps,
      allPrompts.licenseShortName,
    ];
  }

  prompting() {
    return this.askAndSavePrompts();
  }

  configuring() {
    if (this.config.get('frontendDeps')) {
      this.log('Configuring npm now...');
      this.composeWith(require.resolve('generator-npm-init/app'), {
        name: this.config.get('repoName'),
        description: this.config.get('description'),
        repo: `https://github.com/18F/${this.config.get('repoName')}`,
        author: '18f',
        license: this.config.get('licenseShortName'),
      });
    }
  }
};
