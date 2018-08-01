#!/usr/bin/python3

URL = 'https://alojz.cz/api/v1/solution?url_id=/ostrava'

mqttServer = 'xxx'
mqttUser = 'xxx'
mqttPassword = 'xxx'

import urllib.request
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import datetime

now = datetime.datetime.now()
if now.hour == 0 and now.minute == 0:
	publish.single('pocasi/predpoved-dnes', None, retain=True,
		hostname=mqttServer, protocol=mqtt.MQTTv311,
		auth={'username':mqttUser,'password':mqttPassword})
	publish.single('pocasi/predpoved-zitra', None, retain=True,
		hostname=mqttServer, protocol=mqtt.MQTTv311,
		auth={'username':mqttUser,'password':mqttPassword})

rawData = urllib.request.urlopen(URL).read().decode('utf-8')
data = json.loads(rawData)
today = None
tomorrow = None
if data['day1']:
	text = data['day1']['string']
	if data['day1']['today_tomorrow'] == 'dnes':
		today = text
	else:
		tomorrow = text
if data['day2']:
	text = data['day2']['string']
	if data['day2']['today_tomorrow'] == 'dnes':
		today = text
	else:
		tomorrow = text

if today:
	publish.single('pocasi/predpoved-dnes', today, retain=True,
		hostname=mqttServer, protocol=mqtt.MQTTv311,
		auth={'username':mqttUser,'password':mqttPassword})
if tomorrow:
	publish.single('pocasi/predpoved-zitra', tomorrow, retain=True,
		hostname=mqttServer, protocol=mqtt.MQTTv311,
		auth={'username':mqttUser,'password':mqttPassword})
