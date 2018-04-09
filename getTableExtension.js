var logger = require('./logger');

var getTableToQuery = function(extension){
  switch(extension){
    case 'cls':
      return 'ApexClass';
    case 'page':
      return 'ApexPage';
    case 'trigger':
      return 'ApexTrigger';

    default:
      return unknownExtension();
  }

  function unknownExtension(){
    logger.log('Error: extension not supported: ' + extension);
    process.exit();
  }
}

module.exports = getTableToQuery;
