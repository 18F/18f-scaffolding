const allPrompts = require('../app/prompts');
const BaseGenerator = require('../app/base-generator');


module.exports = class extends BaseGenerator {
  constructor(args, options) {
    super(args, options);
    this.prompts = [
      allPrompts.repoName,
      allPrompts.projectFullName,
      allPrompts.description,
      allPrompts.impact,
      allPrompts.stage,
      allPrompts.testable,
      allPrompts.licenseShortName,
      allPrompts.type,
      allPrompts.ownerType,
      allPrompts.partner,
      allPrompts.contactName,
      allPrompts.contactEmail,
      allPrompts.parent,
    ];
  }

  prompting() {
    return this.askAndSavePrompts();
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('about.yml'),
      this.destinationPath('.about.yml'),
      this.config.getAll(),
    );
  }
};
