const path = '/home/paddy/hyraxbio/hyrax-ember-assets/addon-test-support/element-selectors/general.js';
const fs = require('fs');

const replacements = fs.readFileSync(path, {encoding:'utf8'}).split("\n").map(line => {
  if (line.indexOf('data-test') < 0) {
    return false;
  }
  if (!line.endsWith("]',")) { return false; }

  if ((line.match(/data-test/g) || []).length > 1) {
    return false;
  }
  const camelisedSelector = snakeToCamel(dotToCamel(kebabToCamel(extractSelectorFromLine(line))));
  const prop = line.split(':')[0].trim();
  if (camelisedSelector === prop) { return false; }
  return {
    find: prop,
    replace: camelisedSelector
  };
}).filter(item => item).sort((a, b) => {
  return b.replace.length - a.replace.length;
});

console.log(replacements);

function extractSelectorFromLine(line) {
  const matches = line.indexOf(`"`) > -1 ? line.match(/.*="(.*?)".*/) : line.match(/.*\[(.*?)\].*/);
  if (matches) {
    return matches[1];
  } else {
    return line;
  }
}

function kebabToCamel(string = '') {
  return string.replace(/-./g, x=>x[1].toUpperCase());
}

function dotToCamel(string = '') {
  return string.replace(/\../g, x=>x[1].toUpperCase());
}

function snakeToCamel(string = '') {
  return string.replace(/_./g, x=>x[1].toUpperCase());
}
