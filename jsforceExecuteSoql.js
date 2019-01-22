var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');
require('console.table');

// This query breaks it:
// [Select Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds, SystemModstamp, StartTime, Location FROM ApexLog LIMIT 1]

function jsforceExecuteSoql(loginUrl, username, password, saveFileFullPath, saveFileName){
  var soqlFile = readFile(saveFileFullPath);
  var queryToRun = getQueryFromFileContents(soqlFile);
  var fields = getFieldsFromQuery(queryToRun);

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

function getQueryFromFileContents(soqlFileContents) {
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

function getFieldsFromQuery(queryString) {
  var indexOfFrom = queryString.indexOf("from");
  var strInBetweenSelectAndFrom = queryString.substring(7, (indexOfFrom-1));
  var strWithoutWhitespace = strInBetweenSelectAndFrom.replace(/\s/g, '');
  var fields = strWithoutWhitespace.split(',');

  return fields;
}

// Create a method to extract each field from the nested objects
function displayRecords(records, fields) {
  if (!records || !fields) {
    return;
  }

  var displayableRecords = getDisplayableRecords(records, fields);
  display(displayableRecords);

  // TODO: Get the proper case sensitive field names from salesforce
  function getDisplayableRecords(records, fields) {
    var returnRecords = [];

    for (var i=0; i<records.length; i++) {
      var record = records[i];
      var cleanRecord = {};
      
      for (var j=0; j<fields.length; j++) {
        var field = fields[j];
        var fieldSplit = field.split('.');
        var value = record;

        for (var k=0; k<fieldSplit.length; k++) {
          value = getKeyValueFromObject(fieldSplit[k], value);

          // No value, so continue to next field
          if (value == null || value == undefined) {
            value = null;
            continue;
          }
        }

        cleanRecord[field] = value;
      }

      returnRecords.push(cleanRecord);
    }

    function getKeyValueFromObject(key, obj) {
      var keyLowercase = key.toLowerCase();
      var keysInObject = Object.keys(obj);
      var value = {};

      for (var i=0; i<keysInObject.length; i++) {
        var keyInObject = keysInObject[i];

        if (keyLowercase == keyInObject.toLowerCase()) {
          value = obj[keyInObject];
          break;
        }
      }

      return value;
    }

    return returnRecords;
  }


  function display(records) {
    console.log('');
    console.table(records);
    console.log('\nTotal Records: ' + records.length);
  }
}


module.exports = jsforceExecuteSoql;