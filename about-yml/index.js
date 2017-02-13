'use strict';

var path = require('path');

var Generator = require('yeoman-generator');

var prompts = [
  {
    type: 'input',
    name: 'repoName',
    message: 'What\'s the repo name? (A short name that acts as the project identifier)',
    default: process.cwd().split(path.sep).pop()
  },

  {
    type: 'input',
    name: 'projectFullName',
    message: 'What\'s the project title? (A few words, title cased, describing the project)'
  },

  {
    type: 'input',
    name: 'description',
    message: 'What is the problem your project solves? What is the solution?'
  },

  {
    type: 'input',
    name: 'impact',
    message: 'What is the measurable impact of your project?'
  },

  {
    type: 'list',
    name: 'stage',
    message: 'What is your project\'s current status?',
    choices: ['discovery', 'alpha', 'beta', 'live']
  },

  {
     type: 'confirm',
     name: 'testable',
     message: 'Will your project have automated tests?',
     default: true
  },

  {
    type: 'list',
    name: 'type',
    message: 'What type of content is being stored in the repo?',
    choices: ['app', 'docs', 'policy']
  },

  {
    type: 'list',
    name: 'ownerType',
    message: 'What kind of group owns this repo?',
    choices: ['project', 'working-group', 'guild']
  },

  {
    type: 'input',
    name: 'partner',
    message: 'Who is the primary partner for the project? (Use the full name documented here: https://github.com/18F/dashboard/blob/staging/_data/partners.yml )'
  },

  {
    type: 'input',
    name: 'contactName',
    message: 'Who is the primary team contact for the project?'
  },

  {
    type: 'input',
    name: 'contactEmail',
    message: 'What is the primary team contact\'s email address?'
  },

  {
    type: 'input',
    name: 'parent',
    message: 'If this is a sub-repo of another repo, what is the name of that parent repo?',
    default: ''
  }

];

module.exports = Generator.extend({
  prompting: function() {
    return this.prompt(prompts
      .filter( prompt => !this.config.get(prompt.name))
      .map( (prompt) => {
        if (prompt.type === 'input' && !prompt.default) {
          prompt['default'] = '@TODO';
        }
        return prompt;
      })
    ).then( (props) => {
      Object.keys(props).forEach((key) => {
        if (props[key]) {
          this.config.set(key, props[key]);
        }
      });
    });
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('about.yml'),
      this.destinationPath('.about.yml'),
      this.config.getAll()
    );

  }
});
