Function
--------
This test tool it self is a nodejs server.
It keeps sending basic protocols which reproduce the workflow of the Speed.Supernova project's client.

Minimum Requirements
--------------------
(Corntab) Send existing protocol's request to server. Log the server return.

Dependencies
------------
npm install crontab
npm install pomelo

Specification
-------------
Enough to just test main workflow protocols, including:
登录
	authforcelogin
大厅
	creatroom, joinroom, (deliberately not test leaveroom)
房间

游戏

Things to Log
-------------
Messages going out:
[Send]clientTimeStamp(when sent),clientIPAdress,action,msgtype,json

Messages coming in:
[Recieve]serverTimeStamp,clientTimeStamp(when recved),clientIPAdress,isCallback/isNotified,action,failure/success,json

Further Supports
----------------
A python script can read the log to get a summary about loss/sent, success/sent, failure/sent, etc. and other stats.