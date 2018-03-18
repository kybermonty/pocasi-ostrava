#!/usr/bin/python3

URL = 'http://tgftp.nws.noaa.gov/data/observations/metar/stations/LKMT.TXT'

mqttServer = 'xxx'
mqttUser = 'xxx'
mqttPassword = 'xxx'

import urllib.request
from metar import Metar
from collections import OrderedDict
import math
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish

data = urllib.request.urlopen(URL).read().decode('utf-8')
code = data.split('\n')[1]

obs = Metar.Metar(code)

if obs.temp:
  t = int(obs.temp.value('C'))
  publish.single('pocasi/teplota', t, retain=True,
    hostname=mqttServer, protocol=mqtt.MQTTv311,
    auth={'username':mqttUser,'password':mqttPassword})

if obs.dewpt:
  td = int(obs.dewpt.value('C'))

if obs.wind_speed:
  wind = round(obs.wind_speed.value('KMH'), 1)
  publish.single('pocasi/vitr', wind, retain=True,
    hostname=mqttServer, protocol=mqtt.MQTTv311,
    auth={'username':mqttUser,'password':mqttPassword})

if obs.press:
  pressure = int(obs.press.value('HPA'))
  publish.single('pocasi/tlak', pressure, retain=True,
    hostname=mqttServer, protocol=mqtt.MQTTv311,
    auth={'username':mqttUser,'password':mqttPassword})

if t and td:
  num = 112 - (0.1 * t) + td
  denom = 112 + (0.9 * t)
  rh = round(math.pow((num / denom), 8) * 100, 1)
  publish.single('pocasi/vlhkost', rh, retain=True,
    hostname=mqttServer, protocol=mqtt.MQTTv311,
    auth={'username':mqttUser,'password':mqttPassword})


info = None

weather_dict = OrderedDict([
  ('light snow pellets showers', 'slabé sněh. přeh.'),
  ('light snow showers', 'slabé sněh. přeh.'),
  ('light rain showers', 'slabé d. přeh.'),
  ('rain and drizzle', 'slabé d. přeh.'),
  ('drizzle and rain', 'slabé d. přeh.'),
  ('light rain', 'slabý déšť'),
  ('light drizzle', 'slabé mrholení'),
  ('light snow', 'mírné sněžení'),
  ('low drifting snow', 'vanoucí sníh'),
  ('patches of fog', 'chuchvalce mlhy'),
  ('freezing fog', 'mrznoucí mlha'),
  ('shallow fog', 'mělká mlha'),
  ('nearby fog', 'místy mlha'),
  ('drizzle', 'mrholení'),
  ('rain', 'déšť'),
  ('snow', 'sníh'),
  ('mist', 'opar'),
  ('fog', 'mlha'),
  ('and', 'a')
])
weather = obs.present_weather()
if weather:
  for key in weather_dict:
    weather = weather.replace(key, weather_dict[key])
  info = weather

if info and ';' in info and len(info) > 18:
  info = info.split(';')[0]

sky_dict = {
  'a few clouds': 'skoro jasno', # malá oblačnost
  'scattered clouds': 'oblačno', # roztroušená oblačnost
  'broken clouds': 'oblačno', # protrhaná oblačnost
  'overcast': 'zataženo'
}
if info is None:
  sky = obs.sky_conditions()
  if sky:
    if ';' in sky:
      sky = sky.split(';')[0]
    for key in sky_dict:
      if key in sky:
        info = sky_dict[key]
        break

if info is None:
  info = 'jasno'

publish.single('pocasi/stav', info, retain=True,
  hostname=mqttServer, protocol=mqtt.MQTTv311,
  auth={'username':mqttUser,'password':mqttPassword})
