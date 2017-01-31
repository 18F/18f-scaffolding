'use strict';

var supportedLanguages = ['Go', 'Node', 'Python', 'Ruby'];
var prompt = {
  type: 'checkbox',
  name: 'languages',
  message: 'What languages will this project use?',
  choices: supportedLanguages.map(function(l) { return {name: l}; })
}

module.exports = {
  supportedLanguages: supportedLanguages,
  promptFor: function(config) {
    if (!config.get('languages')) {
      return [prompt];
    }
    return [];
  },
  saveResultsTo: function(config) {
    return function(props) {
      if (props.languages) {
        config.set('languages', props.languages);
      }
    }
  },
}
