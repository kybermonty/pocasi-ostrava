#!/usr/bin/python3

URL = 'https://alojz.cz/api/v1/solution?url_id=/ostrava'

mqttServer = 'xxx'
mqttUser = 'xxx'
mqttPassword = 'xxx'

import urllib.request
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish

rawData = urllib.request.urlopen(URL).read().decode('utf-8')
data = json.loads(rawData)
today = data['day1']['string']
tomorrow = data['day2']['string']

publish.single('pocasi/predpoved-dnes', today, retain=True,
	hostname=mqttServer, protocol=mqtt.MQTTv311,
	auth={'username':mqttUser,'password':mqttPassword})
publish.single('pocasi/predpoved-zitra', tomorrow, retain=True,
	hostname=mqttServer, protocol=mqtt.MQTTv311,
	auth={'username':mqttUser,'password':mqttPassword})
