#!/usr/bin/python3

mqttServer = 'xxx'
mqttUser = 'xxx'
mqttPassword = 'xxx'

import astral
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish

l = astral.Location(('Ostrava', 'CZ', 49.859248,
                     18.318829, 'Europe/Prague', 218.9))
sun = l.sun()
sunrise = sun['sunrise'].strftime('%H:%M:%S')
sunset = sun['sunset'].strftime('%H:%M:%S')

publish.single('pocasi/slunce-vychod', sunrise, retain=True,
	hostname=mqttServer, protocol=mqtt.MQTTv311,
	auth={'username':mqttUser,'password':mqttPassword})

publish.single('pocasi/slunce-zapad', sunset, retain=True,
	hostname=mqttServer, protocol=mqtt.MQTTv311,
	auth={'username':mqttUser,'password':mqttPassword})
