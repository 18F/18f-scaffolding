/* Manages a TODO list which we generate for users. */

module.exports = {
  add: (config, fs, newTodos) => {
    const todos = config.get('todo') || {};
    Object.assign(todos, newTodos);
    config.set('todo', todos);

    const content = Object.keys(todos)
      .map(key => [`## ${key}`].concat(todos[key]).join('\n[ ] '))
      .join('\n\n\n');
    fs.write('TODO.txt', content);
  },
};
