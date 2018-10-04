var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');


function jsforceRunTests(loginUrl, username, password, classCoverageName, testClassName){
  var conn = new jsforce.Connection({loginUrl});

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
        WHERE Name = '${classCoverageName}'
      `);
    })
    .then((result) => {
      apexClassOrTrigger_result = result.records[0];

      // Query Test Coverage
      return conn.tooling.query(`
        SELECT Coverage, NumLinesCovered, NumLinesUncovered
        FROM ApexCodeCoverageAggregate
        WHERE ApexClassorTriggerId = '${apexClassOrTrigger_result.Id}'
        ORDER BY CreatedDate DESC
        LIMIT 1
      `);
        // AND ApexTestClassId = '01pF00000049LfZIAU'
    })
    .then((result) => {
      let apexCodeCoverage_result = result.records[0];
      let apexClassOrTriggerBody = apexClassOrTrigger_result.Body.split("\n");
      let totalLines = apexCodeCoverage_result.NumLinesCovered + apexCodeCoverage_result.NumLinesUncovered;
      let coveredAverage = ((apexCodeCoverage_result.NumLinesCovered / totalLines) * 100).toFixed(2);

      // Display code lines
      console.log('\n\n');
      for(let i=0; i<apexClassOrTriggerBody.length; i++){
        let lineReference = i+1;
        let colorCode = apexCodeCoverage_result.Coverage.coveredLines.includes(lineReference) 
          ? 'fgGreen' 
          : apexCodeCoverage_result.Coverage.uncoveredLines.includes(lineReference) 
          ? 'fgRed' 
          : 'reset';

        logger.logColor(
          lineReference + ' ' + apexClassOrTriggerBody[i],
          colorCode
        );
      }

      // Display code coverage
      logger.logColor(
        '\n      '
        + coveredAverage +  '%   |   '
        + apexCodeCoverage_result.NumLinesCovered
        + '/' 
        + totalLines,
        'fgCyan'
      );
    })
    .catch((error) => {
      logger.logSaveUnsuccessful(error);
    });
}

module.exports = jsforceRunTests;