const axios = require('axios');
const BaseGenerator = require('../app/base-generator');

module.exports = class extends BaseGenerator {
  writing() {
    const licenseReq = axios.get(
      'https://raw.githubusercontent.com/18F/open-source-policy/master/LICENSE.md')
    .then((response) => {
      this.fs.write(this.destinationPath('LICENSE.md'), response.data);
    });
    const contributingReq = axios.get(
      'https://raw.githubusercontent.com/18F/open-source-policy/master/CONTRIBUTING.md')
    .then((response) => {
      this.fs.write(this.destinationPath('CONTRIBUTING.md'), response.data);
    });
    return Promise.all([licenseReq, contributingReq])
      .catch(this.env.error.bind(this.env));
  }
};
