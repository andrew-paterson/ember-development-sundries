var lib = require('./lib.js');
var jsonApiFile = process.argv[2];
var dest = process.argv[3];
var fs = require('fs');
const camelCase = require('camelcase');

var jsonApi = JSON.parse(fs.readFileSync(jsonApiFile,'utf8'));
var data = jsonApi.data.map(item => {
  var itemData = item.attributes;
  itemData.id = item.id;
  for (var key in item.relationships || {}) {
    if (item.relationships[key].data) {
      var relationshipKey = `${camelCase(item.relationships[key].data.type)}Id`;
      itemData[relationshipKey] = item.relationships[key].data.id;
    }
  }
  return itemData;
});

var stringified = JSON.stringify(data, null, 2);
var lines = stringified.split(/\r?\n/);
outputString = '';

lines.forEach((line) => {
  if (line.indexOf(':') > -1) {
    line = line.replace(/"/g, `'`);
    var parts = line.split(/:(.+)/);
    var first = parts[0].replace(/'/g, '');
    var second = parts[1];
    outputString += `${first}:${second}\n`;
  } else {
    outputString += `${line}\n`;
  }
});

fs.writeFile(dest, outputString, function(err) {
  if(err) {
    console.log(err);
    return err;
  }
  console.log(`Success! ${dest} was saved`);
});


// lib.logJSToFile(data, dest);