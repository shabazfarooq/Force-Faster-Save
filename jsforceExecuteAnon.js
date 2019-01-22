var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');

// TODO: Clean up message prints
// TODO: Check to see if additional filter querys are required for the apex log query. ie: type=API, userId=thisUser

function jsforceExecuteAnon(loginUrl, username, password, saveFileFullPath, saveFileName){
  var executeAnonFileContents = readFile(saveFileFullPath);

  var conn = new jsforce.Connection({loginUrl});

  conn.login(username, password)
    .then((result) => {
      logger.log('Login Successful');

      // Execute Anonymously
      return conn.tooling.executeAnonymous(executeAnonFileContents);
    })
    .then((result) => {
      // Determine if failure
      if (!result || !result.compiled || !result.success) {
        var err = "ERROR: Line " + result.line + ", Column " + result.column + " -- " + result.compileProblem;

        if (result.exceptionStackTrace) {
          err +="\nExceptionStackTrace: " + result.exceptionStackTrace;
        }
        if (result.exceptionMessage) {
          err +="\nExceptionMessage: " + result.exceptionMessage;
        }
        
        throw err;
      }

      // Query latest log file
      return conn.query(`SELECT Id, 
        LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds, SystemModstamp, StartTime, Location
        FROM ApexLog ORDER BY StartTime LIMIT 1`
      );
    })
    .then((result) => {
      if (!result || !result.records || !result.records[0].Id) {
        throw "Error: no debug record exists";
      }

      return conn.tooling.getDebugLog(result.records[0].Id);
    })
    .then((result) => {
      console.log(result);
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
    logger.log('Error: unable to open Apex file (missing) ' + err);
    process.exit();
  }

  return soqlFileContents;
}


module.exports = jsforceExecuteAnon;



/*** THIS FUNCTION NEEDS TO BE ADDED TO ./node_modules/jsforce/lib/api/tooling.js
/**
 * Retrieve Apex Log Body
 *
 * @param {String} apexLogId - Apex Log record Id
 * @param {Callback.<Tooling~ExecuteAnonymousResult>} [callback] - Callback function
 * @returns {Promise.<Tooling~ExecuteAnonymousResult>}
 */
// Tooling.prototype.getDebugLog = function(apexLogId, callback) {
//   var url = this._baseUrl() + "/sobjects/ApexLog/" + apexLogId + "/Body/";
//   return this.request(url).thenCall(callback);
// };
