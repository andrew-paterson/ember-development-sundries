var inputData = `checkAllowedSteps=(action checkAllowedSteps)
setProperty=(action setProperty)
removeSample=(action removeSample)
removeAllSamples=(action removeAllSamples)
setPageStep=(action setPageStep)
setProperty=(action setProperty)
setNegativeControl=(action setNegativeControl)
setPositiveControl=(action setPositiveControl)
constructSamplesArray=(action constructSamplesArray)
ignoredFilesArray=ignoredFilesArray
ignorePositiveControl=ignorePositiveControl
ignoreNegativeControl=ignoreNegativeControl
dataFileObjects=dataFileObjects
checkForControlSamples=settings.checkForControlSamples`;

var lines = inputData.split('\n');
var actionLines = [];
var propLines = [];
lines.forEach(line => {
  if (line.indexOf('(') > -1 && line.indexOf('(') > -1) {
    actionLines.push(line);
  } else {
    propLines.push(line);
  }
});
console.log((actionLines.sort().concat(propLines.sort())).join('\n'));
