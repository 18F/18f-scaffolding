/* Prompts which are shared across multiple sub-generators. We'd like to only
 * ask once.
 */
const path = require('path');

const licenseShortName = 'CC0-1.0';
const supportedLanguages = ['Go', 'Node', 'Python', 'Ruby'];
const languagesPrompt = {
  type: 'checkbox',
  name: 'languages',
  message: 'What languages will this project use?',
  choices: supportedLanguages.map(l => ({ name: l })),
};
const primaryLanguagePrompt = {
  type: 'list',
  name: 'primaryLanguage',
  message: 'What is the primary language (for Travis, Cloud.gov, etc.)?',
  choices: languagesPrompt.choices,
};
const runCommandPrompt = {
  type: 'input',
  name: 'runCommand',
  message: 'What is your application run command (e.g. "node app.js" or "gunicorn my_module.wsgi")?',
  default: '@TODO',
};
const repoNamePrompt = {
  type: 'input',
  name: 'repoName',
  message: 'What\'s the repo name? (A short name that acts as the project identifier)',
  default: process.cwd().split(path.sep).pop(),
};


module.exports = {
  promptsFor: (config, ...prompts) =>
    prompts.filter(prompt => !config.get(prompt.name)),
  saveResultsTo: (config, ...prompts) => ((props) => {
    prompts.forEach((prompt) => {
      const value = props[prompt.name];
      if (value !== undefined) {
        config.set(prompt.name, value);
      }
    });
  }),
  licenseShortName,
  supportedLanguages,
  languagesPrompt,
  primaryLanguagePrompt,
  runCommandPrompt,
  repoNamePrompt,
};
