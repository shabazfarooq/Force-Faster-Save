var jsforce = require('jsforce');
var logger = require('./logger');

var sfdcQueryAndLogin = function(credentials,
                                 tableNameToQuery,
                                 fullPath,
                                 fileName,
                                 timer,
                                 fullPathToUpdateSalesforceComponent,
                                 callback_executeUpdateSalesforceComponent,
                                 updateCredentialsJson,
                                 pathToCredentials){

  var expiredAccessTokenError = 'INVALID_SESSION_ID';
  var query = "SELECT Id FROM " + tableNameToQuery + " WHERE Name='" + fileName + "' AND NamespacePrefix=NULL";
  var conn;

  /**
   * Direct flow
   */
  if(!credentials.generated
      || !credentials.generated.instanceUrl
      || !credentials.generated.accessToken){
    initializeConnection({loginUrl: credentials.loginUrl});
    loginAndQuery();
  }
  else if(credentials && credentials.username && credentials.password){
    initializeConnection({
      instanceUrl: credentials.generated.instanceUrl,
      accessToken: credentials.generated.accessToken
    });
    tryQueryElseLoginAndQuery();
  }
  else{
    logger.log('Error: missing credentials, check credentials.json');
  }

  /**
   * JSForce single process functions
   */
  function initializeConnection(obj){
    conn = new jsforce.Connection(obj);
  }

  function executeLogin(){
    return conn.login(credentials.username, credentials.password);
  }

  function executeQuery(results){
    return conn.query(query);
  }

  function redirectBasedOnExpiredAccessToken(err){
    if(err.errorCode === expiredAccessTokenError){
      initializeConnection({loginUrl: credentials.loginUrl});
      logger.log('Info: access token expired, attempting to renew');
      return loginAndQuery();
    }
    else{
      return handleGenericError(err);
    }
  }

  function handleGenericError(err){
    logger.log(err);
  }

  function executeUpdateToSalesforce(results){
    callback_executeUpdateSalesforceComponent({
      fullPath: fullPath,
      fileId: results.records[0].Id,
      accessToken: conn.accessToken,
      instanceUrl: conn.instanceUrl,
      fullPathToUpdateSalesforceComponent,
      startTime: timer.getStartTime()
    });
  }

  /**
   * JSForce MultiProcess functions
   */
  function loginAndQuery(){
    executeLogin()
      .then((results) => updateCredentialsJson(pathToCredentials, conn.accessToken, conn.instanceUrl))
      .then((results) => executeQuery(results))
      .then((results) => executeUpdateToSalesforce(results))
      .catch((error) => handleGenericError(error));
  }

  function tryQueryElseLoginAndQuery(){
    // generatedData -> query ? success = DONE
    //                        ? fail    = login -> query -> DONE
    executeQuery()
      .then((results) => executeUpdateToSalesforce(results))
      .catch((error) => redirectBasedOnExpiredAccessToken(error));
  }
}

module.exports = sfdcQueryAndLogin;
