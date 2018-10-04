#!/usr/bin/env node

/**
 * Required modules
 */
var getTableExtension = require('./getTableExtension.js');
var validateAndExtractArgs = require('./validateAndExtractArgs.js');
var extractFromFullPath = require('./extractFromFullPath');
var extractFromFullPathForAura = require('./extractFromFullPathForAura');
var executeUpdateSalesforceComponent = require('./executeUpdateSalesforceComponent.js');
var readAndValidateLocalCredentials = require('./readAndValidateLocalCredentials.js');
var sfdcQueryAndLogin = require('./sfdcQueryAndLogin.js');
var Timer = require('./Timer');
var logger = require('./logger');
var updateCredentialsJson = require('./updateCredentialsJson');
var jsforceVisualForceUpdate = require('./jsforceVisualForceUpdate.js');
var jsforceVisualForceUpdate = require('./jsforceVisualForceUpdate.js');
var jsforceAuraUpdate = require('./jsforceAuraUpdate.js');
var jsforceRunTests = require('./jsforceRunTests.js');
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
  saveAuraFile: {
    pathToCredentials: '',
    bundleName: '',
    defType: ''
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



/**
 * START TEMP ADD
 */


if(process.argv[2] == 'test'){
  if(process.argv[3] == 'help'){
    console.log('test CURRENT_DIR TEST_NAME CLASS_COVERAGE');
    console.log('test ~/sfdc-workspace/amazon-uat');
    process.exit();
  }

  // Extract vars
  globalVariables.pathToCredentials = process.argv[3] + '/credentials.json';
  let testClassName = process.argv[4];
  // let classCoverageName = process.argv[5];
  
  // Handle credentials
  var credentialsObj = readAndValidateLocalCredentials(globalVariables.pathToCredentials);
  globalVariables.salesforceCredentials.loginUrl = credentialsObj.loginUrl;
  globalVariables.salesforceCredentials.username = credentialsObj.username;
  globalVariables.salesforceCredentials.password = credentialsObj.password;
  if(credentialsObj.generated){
    globalVariables.salesforceCredentials.generated.instanceUrl = credentialsObj.generated.instanceUrl;
    globalVariables.salesforceCredentials.generated.accessToken = credentialsObj.generated.accessToken;
  }

  // Execute command
  jsforceRunTests(
    globalVariables.salesforceCredentials.loginUrl,
    globalVariables.salesforceCredentials.username,
    globalVariables.salesforceCredentials.password,
    testClassName
  );

  return;
}











/**
 * END TEMP ADD
 */




// Extract relevant variables from full path
var saveFileFullPath = globalVariables.saveFile.fullPath;
var savingAuraFile = saveFileFullPath.includes('/aura/');

if(savingAuraFile){
  var paths = extractFromFullPathForAura(saveFileFullPath);
  globalVariables.pathToCredentials       = paths.pathToCredentials;
  globalVariables.saveAuraFile.bundleName = paths.bundleName;
  globalVariables.saveAuraFile.defType    = paths.defType;
}
else{
  var paths = extractFromFullPath(saveFileFullPath);
  globalVariables.pathToCredentials        = paths.pathToCredentials;
  globalVariables.saveFile.fileName        = paths.fileNameWithoutExtension;
  globalVariables.saveFile.fileNameWithExt = paths.fileNameWithExtension;
  globalVariables.saveFile.fileExtension   = paths.fileExtension;
}


// Print start message
logger.logSaveStart(globalVariables.saveFile.fileNameWithExt, globalVariables.timer.getStartTimeFormated());

// Determine sObject type based on extension, set relevant global variables
if(!savingAuraFile){
  var tableNameToQuery = getTableExtension(globalVariables.saveFile.fileExtension);
  globalVariables.tableNameToQuery = tableNameToQuery;
}

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
if(savingAuraFile){
  jsforceAuraUpdate(
    globalVariables.salesforceCredentials.loginUrl,
    globalVariables.salesforceCredentials.username,
    globalVariables.salesforceCredentials.password,
    globalVariables.saveFile.fullPath,
    globalVariables.saveAuraFile.bundleName,
    globalVariables.saveAuraFile.defType
  );
}
else if(tableNameToQuery == 'ApexPage'){
  jsforceVisualForceUpdate(
    globalVariables.salesforceCredentials.loginUrl,
    globalVariables.salesforceCredentials.username,
    globalVariables.salesforceCredentials.password,
    globalVariables.saveFile.fullPath,
    globalVariables.saveFile.fileName
  );
}
else{
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
}