module.exports = {
  onlyNewPrompts: (config, prompts) =>
    prompts.filter(prompt => !config.get(prompt.name)),

  saveUpdatedPrompts: (config, prompts) => (props) => {
    prompts.forEach((prompt) => {
      const value = props[prompt.name];
      if (value !== undefined) {
        config.set(prompt.name, value);
      }
    });
  },
};
