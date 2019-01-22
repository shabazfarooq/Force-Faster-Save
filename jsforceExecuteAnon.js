var jsforce = require('jsforce');
var fs = require("fs");
var logger = require('./logger');

function jsforceExecuteAnon(loginUrl, username, password, saveFileFullPath, saveFileName){
  var executeAnonFileContents = readFile(saveFileFullPath);

  var conn = new jsforce.Connection({loginUrl});

  conn.login(username, password)
    .then((result) => {
      logger.log('Login Successful');

      return conn.tooling.executeAnonymous(executeAnonFileContents);
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

function displayResponse(response) {
  
}


module.exports = jsforceExecuteAnon;











// SUCCESS
// {
//   line: -1,
//     column: -1,
//       compiled: true,
//         success: true,
//           compileProblem: null,
//             exceptionStackTrace: null,
//               exceptionMessage: null
// }

// FAIL
// {
//   line: 1,
//     column: 13,
//       compiled: false,
//         success: false,
//           compileProblem: 'Unexpected token \'(\'.',
//             exceptionStackTrace: null,
//               exceptionMessage: null
// }