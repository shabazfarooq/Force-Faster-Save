var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');

function jsforceExecuteAnon(loginUrl, username, password, saveFileFullPath, saveFileName){
  var executeAnonFileContents = readFile(saveFileFullPath);

  var conn = new jsforce.Connection({loginUrl});

  conn.login(username, password)
    .then((result) => {
      logger.log('Login Successful');

      console.log('here');

      // return conn.query(queryToRun);
    })
    .then((result) => {

    })
    .catch((error) => {
      logger.logSaveUnsuccessful(error);
    });
}

function readFile(saveFileFullPath){
  var soqlFileContents;
  try{
    var data = fs.readFileSync(saveFileFullPath);
    soqlFileContents = data.toString();
  }
  catch(err){
    logger.log('Error: unable to open Soql file (missing) ' + err);
    process.exit();
  }

  return soqlFileContents;
}


module.exports = jsforceExecuteAnon;