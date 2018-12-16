const Promise = require('bluebird');
const moment = require('moment');
const nunjucks = require('nunjucks');
const compression = require('compression');
const express = require('express');
const app = express();
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();
const WebSocket = require('ws');

nunjucks.configure('views', {
	autoescape: true,
	noCache: true,
	express: app,
});

app.use(compression());
app.use(express.static('public'));

const getData = () => {
	return Promise.props({
		state: redisClient.getAsync('pocasi/stav'),
		temperature: redisClient.getAsync('pocasi/teplota'),
		feelslike: redisClient.getAsync('pocasi/teplota-pocitova'),
		wind: redisClient.getAsync('pocasi/vitr'),
		humidity: redisClient.getAsync('pocasi/vlhkost'),
		pressure: redisClient.getAsync('pocasi/tlak'),
		quality: redisClient.getAsync('pocasi/ovzdusi'),
		warning: redisClient.getAsync('pocasi/vystraha'),
		forecastToday: redisClient.getAsync('pocasi/predpoved-dnes'),
		forecastTomorrow: redisClient.getAsync('pocasi/predpoved-zitra'),
		sunrise: redisClient.getAsync('pocasi/slunce-vychod'),
		sunset: redisClient.getAsync('pocasi/slunce-zapad'),
		updated: redisClient.getAsync('pocasi/aktualizovano'),
	});
};

app.get('/nojs', (req, res) => {
	getData().then((weather) => {
		weather.updated = moment(weather.updated).format('D.M.YYYY H:mm:ss');
		res.render('index.html', { weather: weather });
	});
});

app.get('/api', (req, res) => {
	getData().then((weather) => {
		res.json(weather);
	});
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
	getData().then((weather) => {
		client.send(JSON.stringify(weather));
	});
});
setInterval(() => {
	getData().then((weather) => {
		ws.broadcast(JSON.stringify(weather));
	});
}, 60000);
