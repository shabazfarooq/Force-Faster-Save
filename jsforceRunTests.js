var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');


function jsforceRunTests(loginUrl, username, password, testClassName, classCoverageName){
  var conn = new jsforce.Connection({loginUrl});

  // For use within promises
  var apexClassOrTrigger_result;
  var apexCodeCoverage_result;

  // Login
  conn.login(username, password)
    // Query Test Class Id
    .then((result) => {
      logger.log('Login Successful');

      return conn.tooling.query(`
        SELECT Id
        FROM ApexClass
        WHERE Name = '${testClassName}'
      `);
    })
    // Create Test Class Queue Item
    .then((result) => {
      return conn.tooling.create('ApexTestQueueItem', {ApexClassId: result.records[0].Id});
    })
    .then((result) => {
      if(!result || !result.id || !result.success){
        logger.logSaveUnsuccessful('Error while creating ApexTestQueueItem', result.errors);
        return;
      }

      return waitTillTestFinishes(conn, result.id);
    })
    .catch((error) => {
      logger.logSaveUnsuccessful(error);
    });


  let prevStatus = '';
  let waitTillTestFinishes = function(conn, apexTestQueueItemId){
    conn.tooling.query(`
      SELECT Id, Status
      FROM ApexTestQueueItem
      WHERE Id = '${apexTestQueueItemId}'
      ORDER BY CreatedDate DESC
      LIMIT 1
    `)
      .then((result) => {
        let status = result.records[0].Status; 
        
        if(status == prevStatus){
          process.stdout.write('.');
        }
        else{
          prevStatus = status;
          process.stdout.write('\n' + status);
        }

        if(status == 'Completed'){
          return gatherTestResultsOnSuccess(conn, apexTestQueueItemId);
        }
        else if(status == 'Failed'){
          return;
        }
        else{
          return waitTillTestFinishes(conn, apexTestQueueItemId);
        }
      })
      .catch((error) => {
        logger.logSaveUnsuccessful(error);
      });
  }

  let gatherTestResultsOnSuccess = function(conn, apexTestQueueItemId){
    conn.tooling.query(`
      SELECT Id, Body
      FROM ApexClass
      WHERE Name = '${classCoverageName}'
    `)
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
      logger.logLargeBreak();
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

      return conn.tooling.query(`
        SELECT Id, MethodName, Outcome, Message, StackTrace
        FROM ApexTestResult
        WHERE QueueItemId = '${apexTestQueueItemId}'
        ORDER BY TestTimestamp DESC
      `);
    })
    .then((result) => {
      console.log('\n\n');

      for(let i=0; i<result.records.length; i++){
        let record = result.records[i];
        let failed = record.Outcome == 'Fail' || record.Outcome == 'Complete Fail';

        logger.logColor(
          `[${record.Outcome}] ${record.ApexClass} . ${record.MethodName}`,
          failed ? 'fgRed' : 'fgGreen'
        );
        if(record.Message){
          logger.logColor(
            record.Message,
            'fgCyan'
          );
          logger.logColor(
            record.StackTrace,
            'fgCyan'
          );
          logger.log('');
        }
      }
    })
    .catch((error) => {
      logger.logSaveUnsuccessful(error);
    });
  }
}

module.exports = jsforceRunTests;