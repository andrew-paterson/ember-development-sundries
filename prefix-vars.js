var lib = require('./lib.js');
var varsFile = `${lib.removeTrailingSlash(process.argv[2])}`;
var targetFiles = lib.getFiles(`${lib.removeTrailingSlash(process.argv[3])}`);
var prefixString = process.argv[4];
var fs = require('fs');
const replace = require('replace-in-file');

var vars = fs.readFileSync(varsFile,'utf8').split(/\r?\n/).filter(line => {
  return line.indexOf(':') > -1;
}).map(line => {
  return line.split(':')[0].trim();
});

var fromArray = vars.map(varName => {
  return new RegExp(varName, 'g');
}).concat([new RegExp(`${prefixString}.${prefixString}`, 'g')]);

var toArray = vars.map(varName => {
  return `${prefixString}.${varName}`;
}).concat([prefixString]);

const options = {
  files: targetFiles,
  from: fromArray,
  to: toArray,
  countMatches: true
};

replace(options)
  .then(results => {
    console.log('Replacement results:', results);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });