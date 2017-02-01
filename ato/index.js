'use strict';
var axios = require('axios');
var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  prompting: function () {
    var prompts = [];
    if (!this.config.get('mainRepository')) {
      prompts.push({
        type: 'input',
        name: 'mainRepository',
        message: 'Where is the main repository (url) located?'
      });
    }

    if (!this.config.get('runningLibs')) {
      prompts.push({
        type: 'input',
        name: 'runningLibs',
        message: 'List the known running libraries for this site.'
      });
    }

    if (!this.config.get('siteName')) {
      prompts.push({
        type: 'input',
        name: 'siteName',
        message: 'What is the name of the site?'
      });
    }

    if (!this.config.get('productManager')) {
      prompts.push({
        type: 'input',
        name: 'productManager',
        message: 'Who is/are the Product Manager(s)?'
      });
    }

    if (!this.config.get('technicalPOC')) {
      prompts.push({
        type: 'input',
        name: 'technicalPOC',
        message: 'Who is/are the Technical point of contact(s)?'
      });
    }

    if (!this.config.get('launchDate')) {
      prompts.push({
        type: 'input',
        name: 'launchDate',
        message: 'When is the launch date?'
      });
    }

    return this.prompt(prompts).then(function (props) {
      if (props.mainRepository) {
        this.config.set('mainRepository', props.mainRepository);
      }
      if (props.runningLibs) {
        this.config.set('runningLibs', props.runningLibs);
      }
      if (props.siteName) {
        this.config.set('siteName', props.siteName);
      }
      if (props.productManager) {
        this.config.set('productManager', props.productManager);
      }
      if (props.technicalPOC) {
        this.config.set('technicalPOC', props.technicalPOC);
      }
      if (props.launchDate) {
        this.config.set('launchDate', props.launchDate);
      }
    }.bind(this));
  },
  writing: function () {
    var atoReq = axios.get(
      'https://raw.githubusercontent.com/18F/before-you-ship/18f-pages/_pages/ato/checklist.md'
    ).then(function (response) {
	var contentArr = response.data.split("\n")
	var content = contentArr.slice(15, -2).join("\n");
	content = content.replace('Main repository:** <url>',
			'Main repository:** ' + this.config.get('mainRepository'));
	content = content.replace('    * <url>\n    * ...',
			'    * ' + this.config.get('runningLibs'));
	content = content.replace('Site:** <url>',
			'Site:** ' + this.config.get('siteName'));
	content = content.replace('Product manager:** @<username>',
			'Product manager:** ' + this.config.get('productManager'));
	content = content.replace('Technical point of contact:** @<username>',
			'Technical point of contact:** ' + this.config.get('technicalPOC'));
	content = content.replace('Launch date/deadline:** <date>',
			'Launch date/deadline:** ' + this.config.get('launchDate'));
      this.fs.write(this.destinationPath('ato.md'), content);
    }.bind(this));
  }
});
