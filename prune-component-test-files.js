
var lib = require('./lib.js');
var emberPath = `${lib.removeTrailingSlash(process.argv[2])}`;
var emberTestPath = `${emberPath}/tests`;
var directoryPath = 'integration/components';
var allFiles = lib.getFiles(`${emberTestPath}/${directoryPath}`);
var path = require('path');
var fs = require('fs');

var boilerPlate = [
`import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | testfileRelativePath', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs\`{{testfileRelativePath}}\`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs\`
      {{#testfileRelativePath}}
        template block text
      {{/testfileRelativePath}}
    \`);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});`,
`import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | testfileRelativePath', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs\`{{testfileRelativePath}}\`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs\`
      {{#testfileRelativePath}}
        template block text
      {{/testfileRelativePath}}
    \`);

    assert.dom(this.element).hasText('template block text');
  });
});`,
];

allFiles.forEach(filePath => {
  var testfileRelativePath = lib.removeLeadingSlash(filePath.replace(`${emberTestPath}/${directoryPath}`, ''));
  var componentDeclaration = testfileRelativePath.replace('-test.js', '');
  var angleComponentDeclaration = lib.pathToAngleBracket(componentDeclaration);
  var defaultVersions = boilerPlate.map(item => item.replace(/testfileRelativePath/g, componentDeclaration))
  .concat(boilerPlate.map(item => {
    item = item.replace(/{{testfileRelativePath}}/g, `<${angleComponentDeclaration} />`).replace(/{{#testfileRelativePath}}/g, `<${angleComponentDeclaration}>`).replace(/{{\/testfileRelativePath}}/g, `</${angleComponentDeclaration}>`).replace(/testfileRelativePath/g, componentDeclaration);
    return item
  }));
  var fileContents = fs.readFileSync(filePath, 'utf8');
  const boilerplateMatch = defaultVersions.find(defaultVersion => lib.minifyText(defaultVersion) === lib.minifyText(fileContents));
  if (boilerplateMatch) {
    var outputPath = `${emberPath}/pruned-test-files/${directoryPath}/${testfileRelativePath}`;
    lib.mkdirP(path.dirname(outputPath));
    fs.renameSync(filePath, outputPath);
    console.log(`Pruned ${filePath}`);
  } 
});

lib.cleanEmptyFoldersRecursively(emberTestPath);