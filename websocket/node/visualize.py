#!/user/bin/env python
# -*- coding: utf8 -*-
"""
@file    visualize.py

This file visualize the test result (msg rtt delay)
of the websocket. It is called directly by the 
wsclient.js file as part of the test tool.
"""

import matplotlib.pyplot as plt
import sys

if len(sys.argv) < 2:
	print('usage: {} filename'.format(__file__))
	sys.exit()

with open(sys.argv[1], 'r') as f:
	msgNums, delays = [], []
	header = f.readline()
	for line in f:
		msgNum, delay = [int(e.strip()) for e in line.split(',')]
		msgNums.append(msgNum)
		delays.append(delay)

plt.plot(msgNums, delays)
plt.xlabel('Message #')
plt.ylabel('Delay')
plt.title('Message-Delay in milli-second')
plt.show()