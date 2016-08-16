#!/usr/bin/env node

/**
 * Required modules
 */
var getTableExtension = require('./getTableExtension.js');
var validateAndExtractArgs = require('./validateAndExtractArgs.js');
var extractFromFullPath = require('./extractFromFullPath');
var executeUpdateSalesforceComponent = require('./executeUpdateSalesforceComponent.js');
var readAndValidateLocalCredentials = require('./readAndValidateLocalCredentials.js');
var sfdcQueryAndLogin = require('./sfdcQueryAndLogin.js');
var Timer = require('./Timer');
var logger = require('./logger');
var updateCredentialsJson = require('./updateCredentialsJson');
var UPDATE_SALESFORCE_COMPONENT_JS = 'updateSalesForceComponent.js';

/**
 * Global variables
 */
var globalVariables = {
  salesforceCredentials: {
    loginUrl:'',
    username: '',
    password: '',
    generated: {
      accessToken: '',
      instanceUrl: '',
    }
  },
  saveFile: {
    fullPath: '',
    fileName: '',
    fileNameWithExt: '',
    fileExtension: ''
  },
  tableNameToQuery: '',
  pathToCredentials: '',
  pathToUpdateSalesforceComponent: '',
  timer: new Timer()
}


/**
 * Execute
 */
// Validate and extract command line arguments, set relevant global variables
var validatedArgs = validateAndExtractArgs(process.argv);
globalVariables.saveFile.fullPath = validatedArgs.fullPathToSaveFile;
globalVariables.fullPathToUpdateSalesforceComponent = 
  validatedArgs.fullPathToForceFasterSave + '/' + UPDATE_SALESFORCE_COMPONENT_JS;

// Extract relevant variables from full path
var paths = extractFromFullPath(globalVariables.saveFile.fullPath);
globalVariables.pathToCredentials        = paths.pathToCredentials;
globalVariables.saveFile.fileName        = paths.fileNameWithoutExtension;
globalVariables.saveFile.fileNameWithExt = paths.fileNameWithExtension;
globalVariables.saveFile.fileExtension   = paths.fileExtension;

// Print start message
logger.logSaveStart(globalVariables.saveFile.fileNameWithExt, globalVariables.timer.getStartTimeFormated());

// Determine sObject type based on extension, set relevant global variables
var tableNameToQuery = getTableExtension(globalVariables.saveFile.fileExtension);
globalVariables.tableNameToQuery = tableNameToQuery;

// Validate and ensure local credentials.json exists
var credentialsObj = readAndValidateLocalCredentials(globalVariables.pathToCredentials);
globalVariables.salesforceCredentials.loginUrl = credentialsObj.loginUrl;
globalVariables.salesforceCredentials.username = credentialsObj.username;
globalVariables.salesforceCredentials.password = credentialsObj.password;
if(credentialsObj.generated){
  globalVariables.salesforceCredentials.generated.instanceUrl = credentialsObj.generated.instanceUrl;
  globalVariables.salesforceCredentials.generated.accessToken = credentialsObj.generated.accessToken;
}

// Query component id and push update to Salesforce
sfdcQueryAndLogin(
  globalVariables.salesforceCredentials,
  globalVariables.tableNameToQuery,
  globalVariables.saveFile.fullPath,
  globalVariables.saveFile.fileName,
  globalVariables.timer,
  globalVariables.fullPathToUpdateSalesforceComponent,
  executeUpdateSalesforceComponent,
  updateCredentialsJson,
  globalVariables.pathToCredentials
);
