var prefix = '    ';

var colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};

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
  },
  logApexDebugFail: function(failResult){
    var err = ["ERROR: Line " + failResult.line + ", Column " + failResult.column + " -- " + failResult.compileProblem];

    if (failResult.exceptionStackTrace) {
      err.push("ExceptionStackTrace: " + failResult.exceptionStackTrace);
    }
    if (failResult.exceptionMessage) {
      err.push("ExceptionMessage: " + failResult.exceptionMessage);
    }

    console.log(prefix + '* ');
    for (var i=0; i<err.length; i++) {
      console.log(prefix + '* ' + err[i]);
    }
    console.log(prefix + '* ');
  },
  logColor: function(message, color){
    var colorCode = colors[color] ? colors[color] : colors.reset;

    console.log(colorCode + message + colors.reset);
  },
  logApexDebug: function(debugLog){
    var splitByLines = debugLog.split('\n');
    
    for (var i=0; i<splitByLines.length; i++) {
      var color = splitByLines[i].includes('|DEBUG|') ? "bgRed" : "fgCyan";
      this.logColor(splitByLines[i], color);
    }
  },
  logLargeBreak: function(){
    this.log('\n\n\n\n');
    this.logColor('\n\n\n\n', 'bgYellow');
    this.log('\n\n\n\n');
  }
}

module.exports = logger;
