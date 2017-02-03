'use strict';
var axios = require('axios');
var Generator = require('yeoman-generator');

module.exports = Generator.extend({
  writing: function () {
    var licenseReq = axios.get(
      'https://raw.githubusercontent.com/18F/open-source-policy/master/LICENSE.md'
    ).then(function (response) {
      this.fs.write(this.destinationPath('LICENSE.md'), response.data);
    }.bind(this));
    var contributingReq = axios.get(
      'https://raw.githubusercontent.com/18F/open-source-policy/master/CONTRIBUTING.md'
    ).then(function (response) {
      this.fs.write(this.destinationPath('CONTRIBUTING.md'), response.data);
    }.bind(this));
    return Promise.all([licenseReq, contributingReq]
    ).catch(this.env.error.bind(this.env));
  }
});
