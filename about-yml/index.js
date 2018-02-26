const Generator = require('yeoman-generator');
const allPrompts = require('../app/prompts');
const { onlyNewPrompts, saveUpdatedPrompts } = require('../app/prompts/utils');

const prompts = [
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

module.exports = class extends Generator {
  prompting() {
    return this.prompt(onlyNewPrompts(this.config, prompts))
      .then(saveUpdatedPrompts(this.config, prompts));
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('about.yml'),
      this.destinationPath('.about.yml'),
      this.config.getAll(),
    );
  }
};
