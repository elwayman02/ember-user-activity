'use strict';

var UI      = require('./');
var through = require('through');

module.exports = MockUI;
function MockUI(options) {
  UI.call(this, {
    inputStream: through(),
    outputStream: through(function(data) {
      if (options && options.outputStream) {
        options.outputStream.push(data);
      }
      this.output += data;
    }.bind(this)),
    errorStream: through(function(data) {
      this.errors += data;
    }.bind(this))
  });

  this.output = '';
  this.errors = '';
  this.errorLog = options && options.errorLog || [];
}

MockUI.prototype = Object.create(UI.prototype);
MockUI.prototype.constructor = MockUI;
MockUI.prototype.clear = function() {
  this.output = '';
  this.errors = '';
  this.errorLog = [];
};
