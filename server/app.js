const _ = require('lodash');
const moment = require('moment');
const nunjucks = require('nunjucks');
const compression = require('compression');
const express = require('express');
const app = express();
const mqtt = require('mqtt');
const WebSocket = require('ws');

const weather = {
	state: null,
	temperature: null,
	feelslike: null,
	wind: null,
	humidity: null,
	pressure: null,
	quality: null,
	warning: null,
	forecastToday: null,
	forecastTomorrow: null,
	sunrise: null,
	sunset: null,
	updated: null,
};

nunjucks.configure('views', {
	autoescape: true,
	noCache: true,
	express: app,
});

app.use(compression());
app.use(express.static('public'));

app.get('/nojs', (req, res) => {
	const myWeather = _.clone(weather);
	myWeather.updated = moment(myWeather.updated).format('D.M.YYYY H:mm:ss');
	res.render('index.html', { weather: myWeather });
});

app.get('/api', (req, res) => {
	res.json(weather);
});

const server = app.listen(8008, () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});

const ws = new WebSocket.Server({ server });
ws.broadcast = (data) => {
	ws.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};
ws.on('connection', (client) => {
	client.send(JSON.stringify(weather));
});

const mqttClient = mqtt.connect();

mqttClient.on('connect', () => {
	mqttClient.subscribe('pocasi/#');
});

mqttClient.on('message', function (topic, message) {
	const value = message.toString();
	if (topic === 'pocasi/stav') {
		weather.state = value;
	} else if (topic === 'pocasi/teplota') {
		weather.temperature = value;
	} else if (topic === 'pocasi/teplota-pocitova') {
		weather.feelslike = value;
	} else if (topic === 'pocasi/vitr') {
		weather.wind = value;
	} else if (topic === 'pocasi/vlhkost') {
		weather.humidity = value;
	} else if (topic === 'pocasi/tlak') {
		weather.pressure = value;
	} else if (topic === 'pocasi/ovzdusi') {
		weather.quality = value;
	} else if (topic === 'pocasi/vystraha') {
		weather.warning = value;
	} else if (topic === 'pocasi/predpoved-dnes') {
		weather.forecastToday = value;
	} else if (topic === 'pocasi/predpoved-zitra') {
		weather.forecastTomorrow = value;
	} else if (topic === 'pocasi/slunce-vychod') {
		weather.sunrise = value;
	} else if (topic === 'pocasi/slunce-zapad') {
		weather.sunset = value;
	} else if (topic === 'pocasi/aktualizovano') {
		weather.updated = value;
		setTimeout(() => {
			ws.broadcast(JSON.stringify(weather));
		}, 10000);
	}
});
