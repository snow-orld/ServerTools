WebSockets Performance Test
===========================

### Abstract

The test is performed on a client-server framework. The client will send a pre-difined message object (converted to string) at a certain frequency (default is 10, i.e. send one messageevery other 100ms), in a total duration T (default set to 30) in seconds. Both the frequency and total duration, plus the host and port of the tested server is configurable in the config.js file.

For now, this test tool can only test single client.

### Install

Make sure the following is installed on both server and client machines:

* [Node.js](https://nodejs.org/en/)

* [Python 2.7 or 3+](https://www.python.org/downloads/)

If pip is missing on some Linux machines, try

```
$ sudo apt-get install python-pip
```

Windows:

```
> setup.bat
```

Unix-like os:

```
$ sh setup.sh
```

### Run

Run server on a remote target cloud server:

```
$ node server.js
```

Run client on a machine that would potentially be used as a client:

```
$ node wsclient.js
```

### Test Output

There will be a server.log and a client.log file generated where the corresponding
test scripts are run, when tests are finished. For client only, there will be a summaary output in the console when test is done, plus a figure showing each message's delay. 

Details can be found by examing the log file after running the test.

### Note

Server script will keep listening for new connections even after a test is finished. One needs to manully terminate test server after test is done, in case other program may need to use the same port.

### Reference

Node.js modules used in this simple test tool are listed as follows:

* [ws](https://github.com/websockets/ws)

* [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

### Future Work

The test tool needs to support testing use cases as follows:

1. Asynchronous requests from multiple clients
2. Test under differnt network conditions
3. Provide more details in server and client log files.
4. Robust error handler mechanism.
5. Show test process to user, especially in long test durations.