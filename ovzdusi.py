#!/usr/bin/python3

URL = 'http://portal.chmi.cz/files/portal/docs/uoco/web_generator/aqindex_cze.json'
REGION = 'T'		# Moravskoslezský kraj
STATION = 'TOPRA'	# Ostrava - Přívoz

mqttServer = 'xxx'
mqttUser = 'xxx'
mqttPassword = 'xxx'

import urllib.request
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish

rawData = urllib.request.urlopen(URL).read().decode('utf-8')
data = json.loads(rawData)
legend = data['Legend']
regions = data['States'][0]['Regions']
stations = [x for x in regions if x['Code'] == REGION][0]['Stations']
s = [x for x in stations if x['Code'] == STATION][0]
index = s['Ix']
if index > 0:
	text = [x for x in legend if x['Ix'] == index][0]['Description']

	state = str(index) + ' - ' + text
	publish.single('pocasi/ovzdusi', state, retain=True,
		hostname=mqttServer, protocol=mqtt.MQTTv311,
		auth={'username':mqttUser,'password':mqttPassword})
