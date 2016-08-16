var fs = require('fs');
var logger = require('./logger.js');

var updateCredentialsJson = function(pathToCredientialsJson, accessToken, instanceUrl){
  if(!pathToCredientialsJson || !accessToken || !instanceUrl){
    logger.log('Error: updateCredentialsJson called with missing path, accessToken, instanceUrl');
    return;
  }

  // Load file
  var credentialsJson = require(pathToCredientialsJson);

  // Update object
  if(!credentialsJson.generated){
    credentialsJson.generated = {};
  }
  credentialsJson.generated.accessToken = accessToken;
  credentialsJson.generated.instanceUrl = instanceUrl;

  // Write updated object
  fs.writeFile(
    pathToCredientialsJson,
    JSON.stringify(credentialsJson, null, 2),
    saveFileCallback    
  );

  function saveFileCallback(err){
    if(err){
      logger.log('Unexpected error while writing to' + pathToCredientialsJson + '. ' + err);
    }
    else{
      logger.log('*Updated Access Token and Instance Url*');
    }
  }
}

module.exports = updateCredentialsJson;
