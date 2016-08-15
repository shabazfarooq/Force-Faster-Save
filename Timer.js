var logger = require('./logger');

var Timer = function(){

  this.times;

  this.init = function(){
    this.times = [+new Date()];
  }

  this.getStartTime = function(){
    return this.times[0];
  }

  this.getStartTimeFormated = function(){
    return new Date(this.getStartTime()).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
  }

  this.setStartTime = function(replaceStartTime){
    this.times[0] = replaceStartTime;
  }

  this.getLatest = function(){
    return this.times[this.times.length-1];
  }

  this.addNewTime = function(){
    this.times.push(+new Date());
    return this;
  }

  this.printCurrentDifference = function(){
    var length = this.times.length;
    return printDifference(this.times[length-2], this.times[length-1]);
  }

  this.printOverallDifference = function(){
    var length = this.times.length;
    return printDifference(this.times[0], this.times[length-1]);
  }

  this.getOverallTimeDifference = function(){
    return (this.times[this.times.length-1] - this.times[0]) / 1000;
  }

  function printDifference(startTime, endTime){
    var diffInSeconds = (endTime - startTime) / 1000;
    console.log(diffInSeconds + 's');
  }

  this.init();
}

module.exports = Timer;