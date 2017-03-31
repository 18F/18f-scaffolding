const fs = require('fs');
const path = require('path');

const axios = require('axios');
const helpers = require('yeoman-test');

jest.mock('axios');

describe('18f:gitignores', () => {
  const toRun = path.join(__dirname, '..');
  beforeEach(() => {
    axios.get = jest.fn(() => Promise.resolve({ data: 'File\nExample' }));
  });

  it('generates .gitignore', () => helpers.run(toRun)
    .withPrompts({ languages: ['Go'] })
    .then((dir) => {
      expect(fs.existsSync(path.join(dir, '.gitignore'))).toBeTruthy();
    }));

  it('hits github', () => helpers.run(toRun)
    .withPrompts({ languages: ['Node', 'Python'] })
    .then(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);   // one per language
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/.*github.*Node.gitignore/));
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/.*github.*Python.gitignore/));
    }));

  it('writes the correct content', () => helpers.run(toRun)
    .withPrompts({ languages: ['Go', 'Ruby'] })
    .then((dir) => {
      const result = fs.readFileSync(path.join(dir, '.gitignore'), 'utf-8');
      expect(result).toEqual(expect.stringMatching(/# === Go ===/));
      expect(result).toEqual(expect.stringMatching(/# === Ruby ===/));
      expect(result).toEqual(expect.stringMatching(/File\nExample/));
    }));

  it('does not overwrite content', () => {
    const originalContent = 'Stuff\n\n# === Python ===\n\nalready defined';
    helpers.run(toRun)
      .inTmpDir((dir) => {
        fs.writeFileSync(path.join(dir, '.gitignore'), originalContent);
      })
      .withPrompts({ languages: ['Python', 'Ruby'] })
      .then((dir) => {
        const result = fs.readFileSync(path.join(dir, '.gitignore'), 'utf-8');
        expect(result).toEqual(
          `${originalContent}\n\n# === Ruby ===\nFile\nExample`);
      });
  });
});
