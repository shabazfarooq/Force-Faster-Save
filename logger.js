var prefix = '    ';
var logger = {
  log: function(message){
    console.log(prefix + message);
  },
  logSaveStart: function(fileName, startTime){
    // console.log('Saving "' + fileName + '" @ ' + startTime);
    console.log('[Saving "' + fileName + '" @ ' + startTime + ']');
  },
  logSaveEnd: function(secondsToSave){
    // console.log('Save ended in ' + secondsToSave + 's');
  },
  logSaveSuccessful: function(){
    console.log(prefix + '---------------------');
    console.log(prefix + '   Save Successful   ');
    console.log(prefix + '---------------------');
  },
  logSaveUnsuccessful: function(errorMessage){
    // console.log(prefix + '---------------------');
    console.log(prefix + '* ');
    console.log(prefix + '* ' + errorMessage);
    console.log(prefix + '* ');
  }
}

module.exports = logger;
