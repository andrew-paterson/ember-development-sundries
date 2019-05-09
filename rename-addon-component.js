var fs = require('fs');
var addonPath = process.argv[2];
var currentLocation = process.argv[3];
var destinationLocation = process.argv[4];
var addonName = addonPath.split('/')[addonPath.split('/').length - 1];

var componentFileVersions = [
  {
    type: 'addonJS',
    rootPath: 'addon/components', 
  }, {
    type: 'addonHBS',
    rootPath: 'addon/templates/components',
  }, {
    type: 'appJS',
    rootPath: 'app/components',
  }
];

componentFileVersions.forEach(componentFileVersion => {
  componentFileVersion.currentPath = `${addonPath}/${componentFileVersion.rootPath}/${currentLocation}`;
  componentFileVersion.newPath =  `${addonPath}/${componentFileVersion.rootPath}/${destinationLocation}`;
  fs.renameSync(componentFileVersion.currentPath, componentFileVersion.newPath);
  if (componentFileVersion.type === 'addonJS') {
    updateAddonTemplateImport(componentFileVersion);
  } else if (componentFileVersion.type === 'appJS') {
    updateAppImport(componentFileVersion);
  }
});

function updateAddonTemplateImport(componentFileVersion) {
  var filePaths = getFiles(componentFileVersion.newPath);
  filePaths.forEach(filePath => {
    fs.readFile(filePath, 'utf8', function(err, contents) {
      var layoutLineIndex;
      var lines = contents ? contents.split("\n") : [];
      lines.forEach((line, index) => {
        if (line.indexOf('import layout') > -1) {
          layoutLineIndex = index;
        }
      });
      var nestedLevels = filePath.replace(addonPath, '').split('/').filter(item => {
        return item !== '' && item.indexOf('.js') < 0;
      }).length - 1;
      var levelsUp = '../'.repeat(nestedLevels);
      var outputFilePath = filePath.replace(`${addonPath}/${componentFileVersion.rootPath}/${destinationLocation}`, '');
      
      var importString = `import layout from '${levelsUp}templates/components/${destinationLocation}${outputFilePath}';`;
      lines[layoutLineIndex] = importString.replace('.js', '');
      var final = lines.join("\n");
      fs.writeFile(filePath, final, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log(`${filePath} was saved!`);
      });
    });
  });
}

function updateAppImport(componentFileVersion) {
  var filePaths = getFiles(componentFileVersion.newPath);
  filePaths.forEach(filePath => {
    var outputFilePath = filePath.replace(`${addonPath}/${componentFileVersion.rootPath}/${destinationLocation}`, '');
    var string = `export { default } from '${addonName}/components/${destinationLocation}${outputFilePath}';`;
    var final = string.replace('.js', '');
    fs.writeFile(filePath, final, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(`${filePath} was saved!`);
    });
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