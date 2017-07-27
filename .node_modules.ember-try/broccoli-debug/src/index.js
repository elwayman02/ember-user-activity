'use strict';

const fs = require('fs');
const path = require('path');
const symlinkOrCopy = require('symlink-or-copy');
const Plugin = require('broccoli-plugin');
const TreeSync = require('tree-sync');
const minimatch = require("minimatch");

module.exports = class BroccoliDebug extends Plugin {
  static buildDebugCallback(baseLabel) {
    return (input, labelOrOptions) => {
      // return input value if falsey
      if (!input) {
        return input;
      }

      let options = processOptions(labelOrOptions);
      options.label = `${baseLabel}:${options.label}`;

      if (options.force || shouldSyncDebugDir(options.label)) {
        return new this(input, options);
      }

      return input;
    };
  }

  constructor(node, labelOrOptions) {
    let options = processOptions(labelOrOptions);

    super([node], {
      name: 'BroccoliDebug',
      annotation: `DEBUG: ${options.label}`,
      persistentOutput: true
    });

    this.debugLabel = options.label;
    this._sync = undefined;
    this._haveLinked = false;
    this._debugOutputPath = buildDebugOutputPath(options);
    this._shouldSync = options.force || shouldSyncDebugDir(options.label);
  }

  build() {
    if (this._shouldSync) {
      let treeSync = this._sync;
      if (!treeSync) {
        treeSync = this._sync = new TreeSync(this.inputPaths[0], this._debugOutputPath);
      }

      treeSync.sync();
    }

    if (!this._haveLinked) {
      fs.rmdirSync(this.outputPath);
      symlinkOrCopy.sync(this.inputPaths[0], this.outputPath);
      this._haveLinked = true;
    }
  }
};

function processOptions(labelOrOptions) {
  let options = {
    baseDir: process.env.BROCCOLI_DEBUG_PATH || path.join(process.cwd(), 'DEBUG'),
    force: false
  };

  if (typeof labelOrOptions === 'string') {
    options.label = labelOrOptions;
  } else {
    Object.assign(options, labelOrOptions);
  }

  return options;
}

function sanitize(input) {
  return input
    .replace(/[\/\?<>\\\*\|"]/g, '-');
}

function buildDebugOutputPath(options) {
  let label = sanitize(options.label);
  let debugOutputPath = path.join(options.baseDir, label);

  return debugOutputPath;
}

function shouldSyncDebugDir(_label) {
  if (!process.env.BROCCOLI_DEBUG) { return false; }

  let label = sanitize(_label);

  return minimatch(label, process.env.BROCCOLI_DEBUG);
}

module.exports._shouldSyncDebugDir = shouldSyncDebugDir;
module.exports._buildDebugOutputPath = buildDebugOutputPath;
module.exports._shouldSyncDebugDir = shouldSyncDebugDir;
