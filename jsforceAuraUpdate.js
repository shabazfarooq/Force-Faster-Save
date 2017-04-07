var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');

function jsforceAuraUpdate(loginUrl, username, password, saveFileFullPath, bundleName, defType){
  var newCode = readFile(saveFileFullPath);

  var conn = new jsforce.Connection({loginUrl});

  conn.login(username, password)
    .then((result) => {
      logger.log('Login Successful');

      return conn.query("SELECT Id From AuraDefinition WHERE AuraDefinitionBundle.DeveloperName = '" + bundleName + "' AND DefType = '" + defType + "'");
    })
    .then((result) => {
      result.records[0].Source = newCode;

      return conn.sobject('AuraDefinition').update(result.records[0]);
    })
    .then((result) => {
      logger.logSaveSuccessful();
    })
    .catch((error) => {
      logger.logSaveUnsuccessful(error);
    });
}

function readFile(saveFileFullPath){
  var auraFileContents;
  try{
    var data = fs.readFileSync(saveFileFullPath);
    auraFileContents = data.toString();
  }
  catch(err){
    logger.log('Error: unable to open Aura file (missing) ' + err);
    process.exit();
  }

  return auraFileContents;
}

module.exports = jsforceAuraUpdate;