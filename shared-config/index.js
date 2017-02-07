'use strict';
/* Prompts which are shared across multiple sub-generators. We'd like to only
 * ask once.
 */

const supportedLanguages = ['Go', 'Node', 'Python', 'Ruby'];
const languagesPrompt = {
  type: 'checkbox',
  name: 'languages',
  message: 'What languages will this project use?',
  choices: supportedLanguages.map( l => {return {name: l}} ),
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
}


module.exports = {
  promptsFor: (config, ...prompts) => {
    return prompts.filter( prompt => !config.get(prompt.name) );
  },
  saveResultsTo: (config, ...prompts) => {
    return (props) => {
      prompts.forEach( prompt => {
        var value = props[prompt.name];
        if (value !== undefined) {
          config.set(prompt.name, value);
        }
      });
    }
  },
  supportedLanguages,
  languagesPrompt,
  primaryLanguagePrompt,
  runCommandPrompt,
}
