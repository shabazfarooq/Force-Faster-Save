var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');


function jsforceVisualForceUpdate(loginUrl, username, password, saveFileFullPath, saveFileName){
  var newMarkup = readFile(saveFileFullPath);

  var conn = new jsforce.Connection({loginUrl});

  conn.login(username, password)
    .then((result) => {
      logger.log('Login Successful');

      return conn.query("SELECT Id From ApexPage WHERE Name = '" + saveFileName + "'");
    })
    .then((result) => {
      result.records[0].Markup = newMarkup;

      return conn.sobject('ApexPage').update(result.records[0]);
    })
    .then((result) => {
      logger.logSaveSuccessful();
    })
    .catch((error) => {
      logger.logSaveUnsuccessful(error);
    });
}

function readFile(saveFileFullPath){
  var visualForceFileContents;
  try{
    var data = fs.readFileSync(saveFileFullPath);
    visualForceFileContents = data.toString();
  }
  catch(err){
    logger.log('Error: unable to open VisualForce file (missing) ' + err);
    process.exit();
  }

  return visualForceFileContents;
}

module.exports = jsforceVisualForceUpdate;