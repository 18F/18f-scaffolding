const Generator = require('yeoman-generator');

module.exports = class BaseGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.prompts = [];
  }

  // Note that this will not be called automatically. See
  // http://yeoman.io/authoring/running-context.html
  async askAndSavePrompts() {
    const newPrompts = this.prompts.filter(p => !this.config.get(p.name));
    const props = await this.prompt(newPrompts);
    this.prompts.forEach((prompt) => {
      const value = props[prompt.name];
      if (value !== undefined) {
        this.config.set(prompt.name, value);
      }
    });
  }

  /* Manages a TODO list which we generate for users. */
  addTodos(newTodos) {
    const todos = this.config.get('todo') || {};
    Object.assign(todos, newTodos);
    this.config.set('todo', todos);

    const content = Object.keys(todos)
      .map(key => [`## ${key}`].concat(todos[key]).join('\n[ ] '))
      .join('\n\n\n');
    this.fs.write('TODO.txt', content);
  }
};

