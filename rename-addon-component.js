var fs = require('fs');
var mkdirp = require('mkdirp');
var addonPath = removeTrailingSlash(process.argv[2]);
var currentLocation = removeTrailingSlash(process.argv[3]);
var destinationLocation = removeTrailingSlash(process.argv[4]);
var addonName = addonPath.split('/')[addonPath.split('/').length - 1];

var componentFileVersions = [
  {
    type: 'addonJS',
    rootPath: 'addon/components', 
    paths: []
  }, {
    type: 'addonHBS',
    rootPath: 'addon/templates/components',
    paths: []
  }, {
    type: 'appJS',
    rootPath: 'app/components',
    paths: []
  }
];

var allFiles = [];

componentFileVersions.forEach(componentFileVersion => {
  componentFileVersion.currentPath = `${addonPath}/${componentFileVersion.rootPath}/${currentLocation}`;
  componentFileVersion.newPath =  `${addonPath}/${componentFileVersion.rootPath}/${destinationLocation}`;
  var test = getFiles(componentFileVersion.currentPath).map(item => {
    return {
      oldPath: item,
      newPath: item.replace(currentLocation, destinationLocation),
      type: componentFileVersion.type,
      rootPath: componentFileVersion.rootPath
    };
  });
  allFiles = allFiles.concat(test);
});

allFiles.forEach(file => {
  if (fs.existsSync(file.oldPath) && !fs.existsSync(file.newPath)) {
    var dirPath = `${addonPath}/${file.rootPath}/${destinationLocation}`;
    mkdirP(dirPath);
    fs.renameSync(file.oldPath, file.newPath);
    console.log(`Moved ${file.newPath}`);
  }
  if (file.type === 'addonJS') {
    updateAddonTemplateImport(file);
  } else if (file.type === 'appJS') {
    updateAppImport(file);
  }
});

function removeTrailingSlash(inputPath) {
  var lastChar = inputPath[inputPath.length -1];
  return lastChar === '/' ? inputPath.slice(0, -1) : inputPath;
}

function updateAddonTemplateImport(file) {
  fs.readFile(file.newPath, 'utf8', function(err, contents) {
    var layoutLineIndex;
    var lines = contents ? contents.split("\n") : [];
    lines.forEach((line, index) => {
      if (line.indexOf('import layout') > -1) {
        layoutLineIndex = index;
      }
    });
    var nestedLevels = file.newPath.replace(addonPath, '').split('/').filter(item => {
      return item !== '' && item.indexOf('.js') < 0;
    }).length - 1;
    var levelsUp = '../'.repeat(nestedLevels);
    var outputFilePath = file.newPath.replace(`${addonPath}/${file.rootPath}/${destinationLocation}`, '');
    
    var importString = `import layout from '${levelsUp}templates/components/${destinationLocation}${outputFilePath}';`;
    lines[layoutLineIndex] = importString.replace('.js', '');
    var final = lines.join("\n");
    fs.writeFile(file.newPath, final, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(`${file.newPath} was saved!`);
    });
  });
}

function updateAppImport(file) {
  var outputFilePath = file.newPath.replace(`${addonPath}/${file.rootPath}/${destinationLocation}`, '');
  var string = `export { default } from '${addonName}/components/${destinationLocation}${outputFilePath}';`;
  var final = string.replace('.js', '');
  fs.writeFile(file.newPath, final, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`${file.newPath} was saved!`);
  });
}

function mkdirP(dirPath) {
  mkdirp.sync(dirPath, err => {
    if (err) {
      console.error(err);
    }
  });
}

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