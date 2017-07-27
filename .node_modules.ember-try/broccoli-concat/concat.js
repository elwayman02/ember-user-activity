var Plugin = require('broccoli-plugin');
var FSTree = require('fs-tree-diff');
var path = require('path');
var fs = require('fs-extra');
var merge = require('lodash.merge');
var omit = require('lodash.omit');
var uniq = require('lodash.uniq');
var walkSync = require('walk-sync');
var ensurePosix = require('ensure-posix-path');

var ensureNoGlob = require('./lib/utils/ensure-no-glob');
var isDirectory = require('./lib/utils/is-directory');
var makeIndex = require('./lib/utils/make-index');

module.exports = Concat;
Concat.prototype = Object.create(Plugin.prototype);
Concat.prototype.constructor = Concat;

var id = 0;
function Concat(inputNode, options, Strategy) {
  if (!(this instanceof Concat)) {
    return new Concat(inputNode, options, Strategy);
  }

  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  var inputNodes;
  id++;

  if (process.env.CONCAT_STATS) {
    inputNodes = Concat.inputNodesForConcatStats(inputNode, id, options.outputFile);
  } else {
    inputNodes = [inputNode];
  }

  Plugin.call(this, inputNodes, {
    annotation: options.annotation,
    name: (Strategy.name || 'Unknown') + 'Concat',
    persistentOutput: true
  });

  this.id = id;

  if (Strategy === undefined) {
    throw new TypeError('Concat requires a concat Strategy');
  }

  this.Strategy = Strategy;
  this.sourceMapConfig = omit(options.sourceMapConfig || {}, 'enabled');
  this.allInputFiles = uniq([].concat(options.headerFiles || [], options.inputFiles || [], options.footerFiles || []));
  this.inputFiles = options.inputFiles;
  this.outputFile = options.outputFile;
  this.allowNone = options.allowNone;
  this.header = options.header;
  this.headerFiles = options.headerFiles;
  this._headerFooterFilesIndex = makeIndex(options.headerFiles, options.footerFiles);
  this.footer = options.footer;
  this.footerFiles = options.footerFiles;
  this.separator = (options.separator != null) ? options.separator : '\n';

  ensureNoGlob('headerFiles', this.headerFiles);
  ensureNoGlob('footerFiles', this.footerFiles);

  this._lastTree = FSTree.fromEntries([]);
  this._hasBuilt = false;

  this.encoderCache = {};
}

Concat.inputNodesForConcatStats = function(inputNode, id, outputFile) {
  var dir = process.cwd() + '/concat-stats-for';
  fs.mkdirpSync(dir);

  return [
    require('broccoli-stew').debug(inputNode, {
      dir: dir,
      name: id + '-' + path.basename(outputFile)
    })
  ];
};

Concat.prototype.calculatePatch = function() {
  var currentTree = this.getCurrentFSTree();
  var patch = this._lastTree.calculatePatch(currentTree);

  this._lastTree = currentTree;

  return patch;
};

Concat.prototype.build = function() {
  var patch = this.calculatePatch();

  // We skip building if this is a rebuild with a zero-length patch
  if (patch.length === 0 && this._hasBuilt) {
    return;
  }

  this._hasBuilt = true;

  if (this.Strategy.isPatchBased) {
    return this._doPatchBasedBuild(patch);
  } else {
    return this._doLegacyBuild();
  }
};

Concat.prototype._doPatchBasedBuild = function(patch) {
  if (!this.concat) {
    this.concat = new this.Strategy(merge(this.sourceMapConfig, {
      separator: this.separator,
      header: this.header,
      headerFiles: this.headerFiles,
      footerFiles: this.footerFiles,
      footer: this.footer
    }));
  }

  for (var i = 0; i < patch.length; i++) {
    var operation = patch[i];
    var method = operation[0];
    var file = operation[1];

    switch (method) {
      case 'create':
        this.concat.addFile(file, this._readFile(file));
        break;
      case 'change':
        this.concat.updateFile(file, this._readFile(file));
        break;
      case 'unlink':
        this.concat.removeFile(file);
        break;
    }
  }

  var outputFile = path.join(this.outputPath, this.outputFile);
  var content = this.concat.result();

  // If content is undefined, then we the concat had no input files
  if (content === undefined) {
    if (!this.allowNone) {
      throw new Error('Concat: nothing matched [' + this.inputFiles + ']');
    } else {
      content = '';
    }
  }

  if (process.env.CONCAT_STATS) {
    var fileSizes = this.concat.fileSizes();
    var outputPath = process.cwd() + '/concat-stats-for/' + this.id + '-' + path.basename(this.outputFile) + '.json';

    fs.mkdirpSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, JSON.stringify({
      outputFile: this.outputFile,
      sizes: fileSizes
    }, null, 2));
  }

  fs.outputFileSync(outputFile, content);
};

Concat.prototype._readFile = function(file) {
  return fs.readFileSync(path.join(this.inputPaths[0], file), 'UTF-8');
};

Concat.prototype._doLegacyBuild = function() {
  var separator = this.separator;
  var firstSection = true;
  var outputFile = path.join(this.outputPath, this.outputFile);

  fs.mkdirpSync(path.dirname(outputFile));

  this.concat = new this.Strategy(merge(this.sourceMapConfig, {
    outputFile: outputFile,
    baseDir: this.inputPaths[0],
    cache: this.encoderCache,
    pluginId: this.id
  }));

  return this.concat.end(function(concat) {
    function beginSection() {
      if (firstSection) {
        firstSection = false;
      } else {
        concat.addSpace(separator);
      }
    }

    if (this.header) {
      beginSection();
      concat.addSpace(this.header);
    }

    if (this.headerFiles) {
      this.headerFiles.forEach(function(file) {
        beginSection();
        concat.addFile(file);
      });
    }

    this.addFiles(beginSection);

    if (this.footerFiles) {
      this.footerFiles.forEach(function(file) {
        beginSection();
        concat.addFile(file);
      });
    }

    if (this.footer) {
      beginSection();
      concat.addSpace(this.footer + '\n');
    }
  }, this);
};

Concat.prototype.getCurrentFSTree = function() {
  return FSTree.fromEntries(this.listEntries());
}

Concat.prototype.listEntries = function() {
  // If we have no inputFiles at all, use undefined as the filter to return
  // all files in the inputDir.
  var filter = this.allInputFiles.length ? this.allInputFiles : undefined;
  var inputDir = this.inputPaths[0];
  return walkSync.entries(inputDir, filter);
};

/**
 * Returns the full paths for any matching inputFiles.
 */
Concat.prototype.listFiles = function() {
  var inputDir = this.inputPaths[0];
  return this.listEntries().map(function(entry) {
    return ensurePosix(path.join(inputDir, entry.relativePath));
  });
};

Concat.prototype.addFiles = function(beginSection) {
  var headerFooterFileOverlap = false;
  var posixInputPath = ensurePosix(this.inputPaths[0]);

  var files = this.listFiles().filter(function(file) {
    var relativePath = file.replace(posixInputPath + '/', '');

    // * remove inputFiles that are already contained within headerFiles and footerFiles
    // * allow duplicates between headerFiles and footerFiles

    if (this._headerFooterFilesIndex[relativePath] === true) {
      headerFooterFileOverlap = true;
      return false;
    }

    return !isDirectory(file);
  }, this);

  // raise IFF:
  //   * headerFiles or footerFiles overlapped with inputFiles
  //   * nothing matched inputFiles
  if (headerFooterFileOverlap === false &&
      files.length === 0 &&
      !this.allowNone) {
    throw new Error('Concat: nothing matched [' + this.inputFiles + ']');
  }

  files.forEach(function(file) {
    beginSection();
    this.concat.addFile(file.replace(posixInputPath + '/', ''));
  }, this);
};
