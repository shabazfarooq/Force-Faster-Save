var extractFromFullPathForAura = function(fullPath){
  if(!fullPath){
    console.log('Error: missing fullpath variable');
    process.exit();
  }

  // Return Vars
  var bundleName;
  var defType;
  var pathToCredentials;

  // Vars to determine stuff
  var splitByForwardSlashes = fullPath.split('/');
  var fileNameWithExtension = splitByForwardSlashes[splitByForwardSlashes.length - 1];
  var fileNameWithExtensionSplitByPeriod = fileNameWithExtension.split('.');
  var fileNameWithoutExtension = fileNameWithExtensionSplitByPeriod[0];
  var fileExtension = fileNameWithExtensionSplitByPeriod[1];

  /**
   * Determine bundleName and defType 
   */
  if(fileExtension == 'js'){
    console.log('saving aura JS');

    defType = fileNameWithExtension.endsWith('Renderer.js')   ? 'RENDERER'   : 
              fileNameWithExtension.endsWith('Controller.js') ? 'CONTROLLER' :
              fileNameWithExtension.endsWith('Helper.js')     ? 'HELPER'     : '';

    bundleName = fileNameWithExtension.slice(0, -(defType.length + 3));
  }
  else{
    console.log('saving aura regular');

    defType = (fileExtension == 'cmp')     ? 'COMPONENT'     :
              (fileExtension == 'auradoc') ? 'DOCUMENTATION' :
              (fileExtension == 'design')  ? 'DESIGN'        :
              (fileExtension == 'svg')     ? 'SVG'           :
              (fileExtension == 'css')     ? 'STYLE'         : '';

    bundleName = fileNameWithoutExtension;
  }

  // Error handle
  if(!bundleName || !defType){
    console.log('Error: unable to determine bundle name or def type of aura file');
    process.exit();
  }

  /**
   * Determine path to credentials
   * - Generate path to credentials, assume that parent directory is 3 directories up from full path
   */
  splitByForwardSlashes.pop(); // remove file name
  splitByForwardSlashes.pop(); // remove one directory up
  splitByForwardSlashes.pop(); // remove second directory up
  splitByForwardSlashes.pop(); // remove third directory up
  
  var pathToCredentials = splitByForwardSlashes.join('/') + '/credentials.json';
  

  return {
    pathToCredentials,
    bundleName,
    defType
  }
}

module.exports = extractFromFullPathForAura;
