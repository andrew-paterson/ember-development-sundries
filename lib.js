var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = {
  removeTrailingSlash(inputPath) {
    var lastChar = inputPath[inputPath.length -1];
    return lastChar === '/' ? inputPath.slice(0, -1) : inputPath;
  },

  removeLeadingSlash(inputPath) {
    var firstChar = inputPath[0];
    return firstChar === '/' ? inputPath.substring(1) : inputPath;
  },

  getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()) {
        this.getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
    return files_;
  },

  minifyText(text) {
    return text.replace(/\n\s*\n/g, '').replace(/\s+/g, '');
  },

  mkdirP(dirPath) {
    mkdirp.sync(dirPath, err => {
      if (err) {
        console.error(err);
      }
    });
  },

  cleanEmptyFoldersRecursively(folder) {
    var fs = require('fs');
    var path = require('path');
  
    var isDir = fs.statSync(folder).isDirectory();
    if (!isDir) {
      return;
    }
    var files = fs.readdirSync(folder);
    if (files.length > 0) {
      files.forEach(file => {
        var fullPath = path.join(folder, file);
        this.cleanEmptyFoldersRecursively(fullPath);
      });
  
      // re-evaluate files; after deleting subfolder
      // we may have parent folder empty now
      files = fs.readdirSync(folder);
    }
  
    if (files.length == 0) {
      fs.rmdirSync(folder);
      return;
    }
  }
};