var phantomjs = require('phantomjs-prebuilt');

var executeUpdateSalesforceComponent = function(executionArgs) {
	var program = phantomjs.exec(
		executionArgs.fullPathToUpdateSalesforceComponent,
		executionArgs.fullPath, 
		executionArgs.fileId, 
		executionArgs.accessToken, 
		executionArgs.instanceUrl,
		executionArgs.startTime
	);
	program.stdout.pipe(process.stdout);
	program.stderr.pipe(process.stderr);
	program.on('exit', code => {
	  // console.log(code);
	});
}

module.exports = executeUpdateSalesforceComponent;
