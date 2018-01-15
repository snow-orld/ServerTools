var fs = require('fs');
var python = require('child_process').exec;
const WebSocket = require('ws');
const HOST = require('./config').HOST;
const PORT = require('./config').PORT;
const FREQUENCY = require('./config').FREQUENCY;
const DURATION = require('./config').DURATION;	// in s

const ws = new WebSocket('ws://' + HOST + ':' + PORT, {
	perMessageDeflate: false
});

var message = {
	msgtype: 'trippossync',
	uuid: 'hg-awfent-foaiwha',
	msgobj: {
		roadposition: {x: 12.124981781, y: 0.0, z: 58.10283485},
		rotation: {x: 0.0, y: 180.1244581, z: 0.0},
		uuid: 'hg-awfent-foaiwha',
	},
}

var sentMsgCnt = 1;
var recvMsgCnt = 0;
var msgDelay = {};
var maxDelay = 0;
var minDelay = Infinity;
var avgDelay = 0;
var interval;
var start = 0;
var startDatetime = 0;

var outOfOrdeCnt = 0;
var expectedMessageNum = sentMsgCnt;

ws.on('open', function() {
	start = Date.now()
	startDatetime = new Date()
	console.log('Test Duration is ' + DURATION + 's, Sending Reqeusts at ' + FREQUENCY + '/s ...')

	interval = setInterval( function() {
		ws.send(JSON.stringify({timestamp: Date.now(), messageNum: sentMsgCnt, message: message}));
		sentMsgCnt++;
		if (sentMsgCnt > FREQUENCY * DURATION) {
			clearInterval(interval);
		}
	}, 1000 / FREQUENCY);
});

ws.on('message', function(datastring) {
	data = JSON.parse(datastring);

	delay = Date.now() - data.timestamp;
	msgDelay[data.messageNum] = delay;

	if (data.messageNum < expectedMessageNum) {
		outOfOrdeCnt++;
	}
	expectedMessageNum = data.messageNum + 1;

	if (delay > maxDelay) maxDelay = delay;
	if (delay < minDelay) minDelay = delay;

	avgDelay = avgDelay * recvMsgCnt + delay;
	recvMsgCnt++;
	avgDelay /= recvMsgCnt;

	// console.log(recvMsgCnt, sentMsgCnt, FREQUENCY * DURATION)

	if (recvMsgCnt == FREQUENCY * DURATION) {
		setTimeout(function() {
			ws.terminate();
		}, maxDelay);
	}
});

ws.on('close', function() {
	end = Date.now()
	endDatetime = new Date()
	realDuration = (end - start) > DURATION * 1000 ? DURATION : (end - start) / 1000
	
	if (!fs.existsSync('log')) {
		fs.mkdirSync('log');
	}

	if (!fs.existsSync('data')) {
		fs.mkdirSync('data');
	}

	// Test summary
	result = '[' + startDatetime + ' - ' + endDatetime + ']\n';
	result += "Sending Frequency = " + FREQUENCY + ", Test Duration = " + realDuration + " seconds\n"
	result += "WebSocket statistics for " + HOST + ":\n";
	result += "\tMessages: Send = " + (sentMsgCnt - 1) + ', Received = ' + recvMsgCnt + ", Lost = " + (sentMsgCnt - 1 - recvMsgCnt) + "(" + (sentMsgCnt - 1 - recvMsgCnt) / (sentMsgCnt - 1) + "%) loss\n"
	result += "Approximate round trip times in milli-seconds:\n"
	result += "\tMinimum = " + minDelay + "ms, Maximum = " + maxDelay + "ms, Average = " + avgDelay + "ms\n"
	result += "Message Order:\n"
	result += "\tNumber of out of order messages = " + outOfOrdeCnt + "\n\n";
	console.log(result)

	fs.writeFile('log/client.log', result, {flag: 'a'}, function(err) {
		if (err) {
			return console.error(err);
		}
	});

	// Test detail
	messageDelayFilename = 'data/' + endDatetime.toISOString().replace(/:/g, '_').replace('/\..+/', '') + '_FREQ_' + FREQUENCY + '_DUR_' + DURATION + '.csv'
	detail = 'MessageNumber,RTTDelay(ms)\n';
	for (messageNum in msgDelay) {
		detail += messageNum + ',' + msgDelay[messageNum] + '\n';
	}
	
	fs.writeFile(messageDelayFilename, detail, {flag: 'w+'}, function(err) {
		if (err) {
			return console.error(err);
		}
	});

	// Visualize detail
	python('python visualize.py ' + messageDelayFilename, function(err, stdout, stderr) {
		if (err) {
			return console.error(err)
		}
	});
});
