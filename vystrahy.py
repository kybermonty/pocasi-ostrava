#!/usr/bin/python3

URL = 'http://portal.chmi.cz/files/portal/docs/meteo/om/zpravy/data/sivs_aktual.xml'
REGION = 'T'		# Moravskoslezský kraj
DISTRICT = 'OV'		# okres Ostrava

mqttServer = 'xxx'
mqttUser = 'xxx'
mqttPassword = 'xxx'

import urllib.request
import xml.etree.ElementTree as et
from datetime import datetime
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish

rawData = urllib.request.urlopen(URL).read().decode('utf-8')
root = et.fromstring(rawData)
warnings = []
for country in root.findall("./country[@code='CZ']"):
	for paragraph in country.findall("./text/paragraph[@type='title']"):
		fromDt = datetime.strptime(country.attrib['start-time'], '%Y-%m-%dT%H:%M:%S')
		toDt = datetime.strptime(country.attrib['end-time'], '%Y-%m-%dT%H:%M:%S')
		if not (fromDt <= datetime.now() <= toDt):
			continue
		warnings.append('{} ({}. st, {} - {})'.format(
			paragraph.text, country.attrib['awareness-level-code'],
			fromDt.strftime('%d.%m. %H:%M'), toDt.strftime('%d.%m. %H:%M')))
	for situation in country.findall("./region[@code='{}']/situation".format(REGION)):
		if ('subregion-types' in situation.attrib and
				situation.attrib['subregion-types'] == 'districts' and
	            DISTRICT not in situation.attrib['districts'].split(',')):
			continue
		fromDt = datetime.strptime(situation.attrib['start-time'], '%Y-%m-%dT%H:%M:%S')
		toDt = datetime.strptime(situation.attrib['end-time'], '%Y-%m-%dT%H:%M:%S')
		if not (fromDt <= datetime.now() <= toDt):
			continue
		warnings.append('{} ({}.st, {} - {})'.format(
			situation.attrib['awareness-type'],
			situation.attrib['awareness-level-code'],
			fromDt.strftime('%d.%m. %H:%M'), toDt.strftime('%d.%m. %H:%M')))

if len(warnings):
	text = ' + '.join(warnings)
	publish.single('pocasi/vystraha', text, retain=True,
		hostname=mqttServer, protocol=mqtt.MQTTv311,
		auth={'username':mqttUser,'password':mqttPassword})
