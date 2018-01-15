/*
* logger class to log send and recv messages in readme.txt specified format.
*
* @function: 	file io
*/

var Logger = function() {
	this.logfile = 'log/client.log';
}

Logger.prototype.log = function(message) {
	// body...
	// write to file 
	console.log('writing to file ...');
};