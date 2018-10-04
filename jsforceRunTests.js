var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');


function jsforceVisualForceUpdate(loginUrl, username, password, saveFileFullPath, saveFileName){
  var conn = new jsforce.Connection({loginUrl});

  // Expected vars
  var className = 'ConversionsController';

  // For use within promises
  var apexClassOrTrigger_result;
  var apexCodeCoverage_result;

  // Login
  conn.login(username, password)
    .then((result) => {
      logger.log('Login Successful');

      // Query Apex Class
      return conn.tooling.query(`
        SELECT Id, Body
        FROM ApexClass
        WHERE Name = '${className}'
      `);
    })
    .then((result) => {
      apexClassOrTrigger_result = result.records[0];
      

      // Query Test Coverage
      return conn.tooling.query(`
        SELECT Coverage, NumLinesCovered, NumLinesUncovered
        FROM ApexCodeCoverage
        WHERE ApexClassorTriggerId = '${apexClassOrTrigger_result.Id}'
      `);
        // AND ApexTestClassId = '01pF00000049LfZIAU'
    })
    .then((result) => {
      let apexCodeCoverage_result = result.records[0];
      let apexClassOrTriggerBody = apexClassOrTrigger_result.Body.split("\n");
      let coveredAverage = (apexCodeCoverage_result.NumLinesCovered / apexCodeCoverage_result.NumLinesUncovered) * 100;

      // Display code lines
      for(let i=0; i<apexClassOrTriggerBody.length; i++){
        let lineReference = i+1;
        let prefix = apexCodeCoverage_result.Coverage.coveredLines.includes(lineReference) 
          ? '+ ' 
          : apexCodeCoverage_result.Coverage.uncoveredLines.includes(lineReference) 
          ? '- ' 
          : '  ';

        console.log(prefix + apexClassOrTriggerBody[i]);
        // console.log(lineReference + ' ' + prefix + apexClassOrTriggerBody[i]);
      }

      // Display code coverage
      console.log('');
      console.log(apexCodeCoverage_result.NumLinesCovered 
        + '/' 
        + apexCodeCoverage_result.NumLinesUncovered 
        + ' (' + coveredAverage +  ' %)'
      );
      console.log('');
    })
    .catch((error) => {
      logger.logSaveUnsuccessful(error);
    });
}

module.exports = jsforceRunTests;