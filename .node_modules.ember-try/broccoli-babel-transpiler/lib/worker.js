'use strict';

var transpiler = require('babel-core');
var workerpool = require('workerpool');
var Promise = require('rsvp').Promise;
var ParallelApi = require('./parallel-api');

// transpile the input string, using the input options
function transform(string, options) {
  return new Promise(function(resolve) {
    var result = transpiler.transform(string, ParallelApi.deserializeOptions(options));
    // this is large, not used, and can't be serialized anyway
    delete result.ast;

    resolve(result);
  });
}

// create worker and register public functions
workerpool.worker({
  transform: transform
});
