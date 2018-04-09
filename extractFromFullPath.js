var extractFromFullPath = function(fullPath){
  if(!fullPath){
    console.log('Error: missing fullpath variable');
    process.exit();
  }

  // Add validation after each step
  var splitByForwardSlashes = fullPath.split('/');
  var fileNameWithExtension = splitByForwardSlashes[splitByForwardSlashes.length - 1];
  var fileNameWithExtensionSplitByPeriod = fileNameWithExtension.split('.');
  var fileNameWithoutExtension = fileNameWithExtensionSplitByPeriod[0];
  var fileExtension = fileNameWithExtensionSplitByPeriod[1];

  // Generate path to credentials, assume that parent directory is 2 directories up
  // from full path
  splitByForwardSlashes.pop(); // remove file name
  splitByForwardSlashes.pop(); // remove one directory up
  splitByForwardSlashes.pop(); // remove second directory up
  
  var pathToCredentials = splitByForwardSlashes.join('/') + '/credentials.json';

  return {
    pathToCredentials,
    fileNameWithoutExtension,
    fileNameWithExtension,
    fileExtension
  }
}

module.exports = extractFromFullPath;
