var fs = require('fs');
var mkdirp = require('mkdirp');
const path = require('path');

var componentSourceDir = path.resolve(process.argv[2]);
var addonPath = path.resolve(process.argv[3]);
var addonComponentPath = path.resolve(process.argv[4]);
var addonName = addonPath.split('/')[addonPath.split('/').length - 1];
var allFiles = getFiles(componentSourceDir);

allFiles.forEach(function(filePath) {
  processFile(`${filePath.replace(componentSourceDir, '')}`);
});

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

function processFile(outputFilePath) {
  createAppFile(outputFilePath);
  createTemplateFile(outputFilePath);
  fs.readFile(`${componentSourceDir}${outputFilePath}`, 'utf8', function(err, contents) {
    createAddonFile(contents, outputFilePath);
  });
}

function createTemplateFile(outputFilePath) {
  var sourceComponentHbsPath = path.resolve(`${componentSourceDir}${outputFilePath}`.replace('app/components', 'app/templates/components'));
  var sourceComponentHbs = `${sourceComponentHbsPath.split('.').slice(0, -1).join('.')}.hbs`;
  var outPutPath = `${addonPath}/addon/templates/components/${addonComponentPath}${outputFilePath}`;
  outPutDestination = path.resolve(`${outPutPath.split('.').slice(0, -1).join('.')}.hbs`);
  var directoryPath = outPutDestination.split('/').slice(0, -1).join('/');
  mkdirP(directoryPath);
  copyFile(sourceComponentHbs, outPutDestination);
}

function createAppFile(outputFilePath) {
  var outPutDestination = path.resolve(`${addonPath}/app/components/${addonComponentPath}${outputFilePath}`);
  var string = `export { default } from '${addonName}/components/${addonComponentPath}${outputFilePath}';`.replace(/\/\//g, '/');
  var final = string.replace('.js', '');
  var directoryPath = outPutDestination.split('/').slice(0, -1).join('/');
  mkdirP(directoryPath);
  fs.writeFile(outPutDestination, final, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(path.resolve(`app/components/${addonComponentPath}${outputFilePath}`) + ` was saved!`);
  });
}

function createAddonFile(contents, outputFilePath) {
  var lines = contents ? contents.split("\n") : [];
  var refIndex;
  lines.forEach(function(line, index) {
    if (line.indexOf('export default ') > -1) {
      refIndex = index;
    }
  });
  console.log('level;')
  console.log(path.resolve(`${addonComponentPath}${outputFilePath}`))
  var nestedLevels = path.resolve(`${addonComponentPath}${outputFilePath}`).split('/').filter(item => item).length;
  var outPutDestination = path.resolve(`${addonPath}/addon/components/${addonComponentPath}${outputFilePath}`);
  var levelsUp = '../'.repeat(nestedLevels);

  var string = `import layout from '${levelsUp}templates/components/${addonComponentPath}${outputFilePath}';`.replace(/\/\//g, '/');

  var newLineImport = string.replace('.js', '');
  lines.splice(refIndex - 1, 0, newLineImport);
  lines.splice(refIndex + 2, 0, "  layout,");
  var final = lines.join("\n");

  var directoryPath = outPutDestination.split('/').slice(0, -1).join('/');
  mkdirP(directoryPath);
  fs.writeFile(outPutDestination, final, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`addon/components/${addonComponentPath}${outputFilePath} was saved!`);
  });
}

function mkdirP(dirPath) {
  mkdirp.sync(dirPath, err => {
    if (err) {
      console.error(err);
    }
  });
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (cb && !cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}