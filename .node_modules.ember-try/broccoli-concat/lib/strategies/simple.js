'use strict';
var findIndex = require('find-index');
var merge = require('lodash.merge');

function contentMapper(entry) {
  return entry.content;
}

function notUndefined(content) {
  return content !== undefined;
}

function SimpleConcat(attrs) {
  this.separator = attrs.separator || '';

  this.header = attrs.header;
  this.headerFiles = attrs.headerFiles || [];
  this.footerFiles = attrs.footerFiles || [];
  this.footer = attrs.footer;

  // Internally, we represent the concatenation as a series of entries. These
  // entries have a 'file' attribute for lookup/sorting and a 'content' property
  // which represents the value to be used in the concatenation.
  this._internal = [];

  // We represent the header/footer files as empty at first so that we don't
  // have to figure out order when patching
  this._internalHeaderFiles = this.headerFiles.map(function(file) { return { file: file } });
  this._internalFooterFiles = this.footerFiles.map(function(file) { return { file: file } });
}

SimpleConcat.isPatchBased = true;

SimpleConcat.prototype = merge(SimpleConcat.prototype, {
  /**
   * Finds the index of the given file in the internal data structure.
   */
  _findIndexOf: function(file) {
    return findIndex(this._internal, function(entry) { return entry.file === file; });
  },

  /**
   * Updates the contents of a header file.
   */
  _updateHeaderFile: function(fileIndex, content) {
    this._internalHeaderFiles[fileIndex].content = content;
  },

  /**
   * Updates the contents of a footer file.
   */
  _updateFooterFile: function(fileIndex, content) {
    this._internalFooterFiles[fileIndex].content = content;
  },

  /**
   * Determines if the given file is a header or footer file, and if so updates
   * it with the given contents.
   */
  _handleHeaderOrFooterFile: function(file, content) {
    var headerFileIndex = this.headerFiles.indexOf(file);
    if (headerFileIndex !== -1) {
      this._updateHeaderFile(headerFileIndex, content);
      return true;
    }

    var footerFileIndex = this.footerFiles.indexOf(file);
    if (footerFileIndex !== -1) {
      this._updateFooterFile(footerFileIndex, content);
      return true;
    }

    return false;
  },

  addFile: function(file, content) {
    if (this._handleHeaderOrFooterFile(file, content)) {
      return;
    }

    var entry = {
      file: file,
      content: content
    };

    var index = findIndex(this._internal, function(entry) { return entry.file > file; });
    if (index === -1) {
      this._internal.push(entry);
    } else {
      this._internal.splice(index, 0, entry);
    }
  },

  updateFile: function(file, content) {
    if (this._handleHeaderOrFooterFile(file, content)) {
      return;
    }

    var index = this._findIndexOf(file);

    if (index === -1) {
      throw new Error('Trying to update ' + file + ' but it has not been read before');
    }

    this._internal[index].content = content;
  },

  removeFile: function(file) {
    if (this._handleHeaderOrFooterFile(file, undefined)) {
      return;
    }

    var index = this._findIndexOf(file);

    if (index === -1) {
      throw new Error('Trying to remove ' + file + ' but it did not previously exist');
    }

    this._internal.splice(index, 1);
  },

  fileSizes: function() {
    return [].concat(
      this._internalHeaderFiles,
      this._internal,
      this._internalFooterFiles
    ).reduce(function(sizes, entry) {
      sizes[entry.file] = entry.content.length;
      return sizes;
    }, {});
  },

  result: function() {
    var fileContents = [].concat(
      this._internalHeaderFiles.map(contentMapper),
      this._internal.map(contentMapper),
      this._internalFooterFiles.map(contentMapper)
    ).filter(notUndefined);

    if (!fileContents.length) {
      return;
    }

    var content = [].concat(
      this.header,
      fileContents,
      this.footer
    ).filter(notUndefined).join(this.separator);

    return content;
  },
});

module.exports = SimpleConcat;
