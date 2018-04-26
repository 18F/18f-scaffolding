/* Prompts which are shared across multiple sub-generators. We'd like to only
 * ask once.
 */
const path = require('path');

const supportedLanguages = ['Go', 'Node', 'Python', 'Ruby'];
const languageChoices = supportedLanguages.map(name => ({ name }));

const prompts = {
  cloudGovServices: {
    type: 'checkbox',
    message: 'Will this project need any of these services?',
    choices: ['database', 'secrets'],
  },
  description: {
    type: 'input',
    message: 'What is the problem your project solves? What is the solution?',
    default: '@TODO',
  },
  frontendDeps: {
    type: 'confirm',
    message: 'Will this project have front end libraries/dependencies',
    default: true,
  },
  languages: {
    type: 'checkbox',
    message: 'What languages will this project use?',
    choices: languageChoices,
  },
  licenseShortName: {
    type: 'input',
    message: 'What license is this under? Use the SPDX name.',
    default: 'CC0-1.0',
  },
  primaryLanguage: {
    type: 'list',
    message: 'What is the primary language (for Travis, Cloud.gov, etc.)?',
    choices: languageChoices,
  },
  projectFullName: {
    type: 'input',
    message: 'What\'s the project title? (A few words, title cased, describing the project)',
    default: '@TODO',
  },
  repoName: {
    type: 'input',
    message: 'What\'s the repo name? (A short name that acts as the project identifier)',
    default: process.cwd().split(path.sep).pop(),
  },
  runCommand: {
    type: 'input',
    message: 'What is your application run command (e.g. "node app.js" or "gunicorn my_module.wsgi")?',
    default: '@TODO',
  },
};

// Standardize the prompt names
Object.keys(prompts).forEach((key) => {
  prompts[key].name = key;
});

module.exports = prompts;
