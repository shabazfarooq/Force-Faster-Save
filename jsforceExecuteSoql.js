var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');
require('console.table');

function jsforceExecuteSoql(loginUrl, username, password, saveFileFullPath, saveFileName){
  var soqlFile = readFile(saveFileFullPath);
  var queryToRun = getQuery(soqlFile);
  var fields = getFields(queryToRun);

  var conn = new jsforce.Connection({loginUrl});

  conn.login(username, password)
    .then((result) => {
      logger.log('Login Successful');

      return conn.query(queryToRun);
    })
    .then((result) => {
      displayRecords(result.records, fields);
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

function getQuery(soqlFileContents) {
  var query = '';
  var queryStarted = false;

  // Iterate over characters
  for (var i=0; i<soqlFileContents.length; i++) {
    var currentCharacter = soqlFileContents[i];

    // Find starting character
    if (currentCharacter == '[') {
      queryStarted = true;
    }
    // Break once query ends
    else if (currentCharacter == ']') {
      break;
    }
    // Add characters to query if query is started
    else if (queryStarted) {
      query += currentCharacter == '\n' ? ' ' : currentCharacter;
    }
  }

  return query;
}

// TODO: Extract comma separated fields between SELECT and FROM
function getFields(queryString) {
  return 'id, name, createdby.name';
}

// Create a method to extract each field from the nested objects
function displayRecords(records, fields) {
  

  console.log(records);
  if (!records) {
    return;
  }

  var recordsLength = records.length;

  for (var i=0; i<recordsLength; i++) {
    delete records[i].attributes;
  }

  console.table(records);
  console.log('\nTotal Records: ' + recordsLength);
}

module.exports = jsforceExecuteSoql;