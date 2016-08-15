var logger = require('./logger');

/**
 * Currently expected command line arguments
 * 2 - Full Path
 */
var validateAndExtractArgs = function(args){
	if(args.length <= 2){
    logger.log('Error: Please provide full file path parameter');
		process.exit();
	}

  var fullPathToMainJs = args[1];
  var fullPathToMainJsSplitByForwardSlashes = fullPathToMainJs.split('/');
  fullPathToMainJsSplitByForwardSlashes.pop();
  var fullPathToForceFasterSave = fullPathToMainJsSplitByForwardSlashes.join('/');

  return{
    fullPathToSaveFile: args[2],
    fullPathToForceFasterSave
  }
}

module.exports = validateAndExtractArgs;
