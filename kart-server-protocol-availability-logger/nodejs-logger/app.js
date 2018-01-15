var pomelo = require('pomelo-client');
var crontab = require('crontab');
var logger = require('./utils.logger');

/*
* Init pomelo client and connection
*/
function init() {
	
	// pomelo init
	pomelo.init({
		host: '106.14.179.185',
		port: 3014,
		user: {},
		handshakeCallback: function(){}
	}, function() {
		console.log("Pomelo client initiated.");
		logger.log("Pomelo client initiated");
	});

	// connect to server
	pomelo.connect(null, function(data) {
		console.log("<- " + data);
	});
}

function main() {
	console.log(pomelo);
	pomelo.init();
}

main();