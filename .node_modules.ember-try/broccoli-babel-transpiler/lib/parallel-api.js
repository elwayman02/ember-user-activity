'use strict';

var transpiler = require('babel-core');
var path = require('path');
var workerpool = require('workerpool');
var Promise = require('rsvp').Promise;
var debugGenerator = require('heimdalljs-logger');

var jobs = Number(process.env.JOBS) || require('os').cpus().length;

// create a worker pool using an external worker script
var pool = workerpool.pool(path.join(__dirname, 'worker.js'), { maxWorkers: jobs });

var loggerName = 'broccoli-persistent-filter:ParallelApi';
var _logger = debugGenerator(loggerName);


function implementsParallelAPI(object) {
  return typeof object._parallelBabel === 'object' &&
         typeof object._parallelBabel.requireFile === 'string';
}

function pluginCanBeParallelized(plugin) {
  return typeof plugin === 'string' || implementsParallelAPI(plugin);
}

function pluginsAreParallelizable(plugins) {
  return plugins === undefined || plugins.every(pluginCanBeParallelized);
}

function callbacksAreParallelizable(options) {
  return Object.keys(options).every(function(key) {
    let option = options[key];
    return typeof option !== 'function' || implementsParallelAPI(option);
  });
}

function transformIsParallelizable(options) {
  return pluginsAreParallelizable(options.plugins) &&
         callbacksAreParallelizable(options);
}

function buildFromParallelApiInfo(parallelApiInfo) {
  var requiredStuff = require(parallelApiInfo.requireFile);

  if(parallelApiInfo.useMethod) {
    if (requiredStuff[parallelApiInfo.useMethod] === undefined) {
      throw new Error("method '" + parallelApiInfo.useMethod + "' does not exist in file " + parallelApiInfo.requireFile);
    }
    return requiredStuff[parallelApiInfo.useMethod];
  }

  if (parallelApiInfo.buildUsing) {
    if (typeof requiredStuff[parallelApiInfo.buildUsing] !== 'function') {
      throw new Error("'" + parallelApiInfo.buildUsing + "' is not a function in file " + parallelApiInfo.requireFile);
    }
    return requiredStuff[parallelApiInfo.buildUsing](parallelApiInfo.params);
  }

  return requiredStuff;
}

// convert the options to the format that babel expects
function deserializeOptions(options) {
  var newOptions = options;

  // transform callbacks
  Object.keys(options).forEach((key) => {
    if (implementsParallelAPI(options[key])) {
      newOptions[key] = buildFromParallelApiInfo(options[key]._parallelBabel);
    }
  });

  // transform plugins
  if (options.plugins !== undefined) {
    newOptions.plugins = options.plugins.map((plugin) => {
      return implementsParallelAPI(plugin) ? buildFromParallelApiInfo(plugin._parallelBabel) : plugin;
    });
  }

  return newOptions;
}

// replace callback functions with objects so they can be transferred to the worker processes
function serializeOptions(options) {
  const serializableOptions = {};
  Object.keys(options).forEach((key) => {
    const option = options[key];
    serializableOptions[key] = (typeof option === 'function') ? { _parallelBabel: option._parallelBabel } : option;
  });
  return serializableOptions;
}

function transformString(string, options) {
  if (transformIsParallelizable(options)) {
    _logger.debug('transformString is parallelizable');
    return pool.exec('transform', [string, serializeOptions(options)]);
  }
  else {
    _logger.debug('transformString is NOT parallelizable');
    return new Promise((resolve) => {
      resolve(transpiler.transform(string, deserializeOptions(options)));
    });
  }
}

module.exports = {
  jobs,
  implementsParallelAPI,
  pluginCanBeParallelized,
  pluginsAreParallelizable,
  callbacksAreParallelizable,
  transformIsParallelizable,
  deserializeOptions,
  serializeOptions,
  buildFromParallelApiInfo,
  transformString,
};
