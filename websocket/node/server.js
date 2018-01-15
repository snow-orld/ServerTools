var fs = require('fs');
var WebSocketServer = require('websocket').server;
var http = require('http');
const HOST = require('./config').HOST;
const PORT = require('./config').PORT;
const FREQUENCY = require('./config').FREQUENCY;
const DURATION = require('./config').DURATION;

var server = http.createServer();
server.listen(PORT, function() {
	console.log("Listening on %d", PORT)
});

wsServer = new WebSocketServer({
	httpServer: server
});

recvMsgCnt = 0;
repliedMsgCnt = 0;

wsServer.on('request', function(request) {
	var connection = request.accept(null, request.origin);
	start = Date.now()
	console.log('Running tests ...')

	connection.on('message', function(message) {
		// console.log('< recieved ' + JSON.stringify(message));
		data = message.utf8Data;
		recvMsgCnt++;
		connection.send(data);
		repliedMsgCnt++;
		// console.log('> Echo ' + data)

	});

	connection.on('close', function(connection) {
		console.log('connection closed')

		if (!fs.existsSync('log')) {
			fs.mkdirSync('log');
		}

		result = '[' + new Date() + ']\n';
		result += "Sending Frequency = " + FREQUENCY + ", Test Duration = " + DURATION + " seconds\n"
		result += "WebSocket statistics on host " + HOST + ":\n";
		result += "\tMessages: Received = " + recvMsgCnt + ', Replied = ' + repliedMsgCnt + ", Expected = " + FREQUENCY * DURATION + "\n"
		result += "Total Response Time = " + (Date.now() - start) / 1000 + " s\n\n"

		fs.writeFile('log/server.log', result, {flag: 'a'}, function(err) {
			if (err) {
				return console.error(err);
			}
		});

	});
});
