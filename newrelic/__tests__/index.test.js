const fs = require('fs');
const path = require('path');

const helpers = require('yeoman-test');


describe('18f:newrelic', () => {
  const toRun = path.join(__dirname, '..');

  // Checks to make sure new relic config files are generated
  it('generates newrelic.ini', () => helpers.run(toRun)
    .withPrompts({ languages: ['Python'] })
    .then((dir) => {
      expect(fs.existsSync(path.join(dir, 'newrelic.ini'))).toBeTruthy();
    }));
  it('generates newrelic.yml', () => helpers.run(toRun)
    .withPrompts({ languages: ['Ruby'] })
    .then((dir) => {
      expect(fs.existsSync(path.join(dir, 'newrelic.yml'))).toBeTruthy();
    }));
  it('generates newrelic.js', () => helpers.run(toRun)
    .withPrompts({ languages: ['Node'] })
    .then((dir) => {
      expect(fs.existsSync(path.join(dir, 'newrelic.js'))).toBeTruthy();
    }));

  it('writes the correct content for Python', () => helpers.run(toRun)
    .withPrompts({ primaryLanguage: 'Python', repoName: 'Testing', languges: ['Python', 'Ruby', 'Node']})
    .then((dir) => {
      const result = fs.readFileSync(path.join(dir, 'manifest_dev.yml'), 'utf-8');
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_APP_NAME: Testing (dev)/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_CONFIG_FILE: newrelic.ini/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_ENV: dev/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_LOG: stdout/));
    }));
  it('writes the correct content for Ruby', () => helpers.run(toRun)
    .withPrompts({ primaryLanguage: 'Ruby', repoName: 'Testing', languges: ['Python', 'Ruby', 'Node']})
    .then((dir) => {
      const result = fs.readFileSync(path.join(dir, 'manifest_dev.yml'), 'utf-8');
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_APP_NAME: Testing (dev)/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_CONFIG_FILE: newrelic.yml/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_ENV: dev/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_LOG: stdout/));
    }));
  it('writes the correct content for Node', () => helpers.run(toRun)
    .withPrompts({ primaryLanguage: 'Node', repoName: 'Testing', languges: ['Python', 'Ruby', 'Node']})
    .then((dir) => {
      const result = fs.readFileSync(path.join(dir, 'manifest_dev.yml'), 'utf-8');
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_APP_NAME: Testing (dev)/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_CONFIG_FILE: newrelic.js/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_ENV: dev/));
      expect(result).toEqual(expect.stringMatching(/NEW_RELIC_LOG: stdout/));
    }));
});
