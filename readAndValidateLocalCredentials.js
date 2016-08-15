var logger = require('./logger');

var readAndValidateLocalCredentials = function(credentialsFilePath){
  var loginCredentials = require(credentialsFilePath);
  handleMissingKeys();

  return loginCredentials;

  function handleMissingKeys(){
    if(!loginCredentials.loginUrl
        || !loginCredentials.username
        || !loginCredentials.password){
      logger.log('Error: expecting loginUrl, username and password to be set within credentials.json');
      process.exit();
    }
  }
}

module.exports = readAndValidateLocalCredentials
