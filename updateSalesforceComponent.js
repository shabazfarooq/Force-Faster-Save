/**
 *
 * Expected args:
 *  1 - Full Path
 *  2 - File Id
 *  3 - Access Token
 *  4 - Instance Url
 *  5 - Start time
 */

var Timer = require('./Timer.js');
var system = require('system');
var logger = require('./logger');
var args = system.args;

validateArgs(args);
function validateArgs(args){
  if(args.length < 6){
    logger.log('Error: please provide full file path, file Id, access token, and instance URL args');
    phantom.exit();
  }
}

var fullPath    = args[1];
var fileId      = args[2];
var accessToken = args[3];
var instanceUrl = args[4];
var timer = new Timer();
timer.setStartTime(args[5]);
timer.addNewTime();

/**
 * Read file
 */
var fs = require('fs');
var saveFileContent = fs.read(fullPath);

/**
 * Build URL and initialize page
 */
var goToUrl = instanceUrl + '/secur/frontdoor.jsp?sid=' + accessToken + '&retURL=' + fileId + '/e';
var page = require('webpage').create();

/**
 * 
 */
page.open(goToUrl, function(status){
  try{
    logger.log('Opening page ' + status);

    if(status !== 'success'){
      exit(1);
    }
    
    /**
     * Flow calls
     */
    waitForPageToLoad();
    saveCode();
    waitForSaveToFinish();
    getSaveResult();
    exit(0);

    /**
     * Helper methods
     */
    function waitForPageToLoad(){
      logger.log('Waiting for codeEditor');
      
      do{
        page.sendEvent('mousemove');
      }
      while(isCodeEditorAvailable());

      function isCodeEditorAvailable(){
        return page.evaluate(function(){
          return typeof(codeEditor) == "undefined";
        });
      }
    }

    function saveCode(){
      // logger.log('Attempting save');
      
      page.evaluate(
        function(codeToSave){
          codeEditor.setValue(codeToSave);
          document.querySelectorAll('.btn')[1].click();
        },
        saveFileContent
      );
    }

    function waitForSaveToFinish(){
      logger.log('Saving...');
      
      do{
        page.sendEvent('mousemove');
      }
      while (disabledButtonCount() > 0);

      function disabledButtonCount(){
        return page.evaluate(function() {
            return document.querySelectorAll('.btnDisabled').length;
          }
        );
      }
    }

    function getSaveResult(){
      logger.log('Getting save result...');

      var saveError = getSaveErrors();
      if(saveError){
        logger.logSaveUnsuccessful(saveError);
      }
      else{
        logger.logSaveSuccessful();
      }

      function getSaveErrors(){
        return page.evaluate(
          function() {
            var returnError;

            try{
              returnError = document.getElementsByClassName('detailHeaderHighlightMsg')[0].querySelectorAll('td')[1].innerText;
            }
            catch(error){
              // surpress exception
            }

            return returnError;
          }
        );
      }
    }
  }
  catch(err){
    logger.log('*****ERROR******: ' + err);
    exit();
  }

  function exit(errorCode){
    // logger.log( errorCode == 0 ? 'Exiting :)' : 'There was an error :(');
    logger.logSaveEnd(timer.addNewTime().getOverallTimeDifference());
    phantom.exit();
  }
});
