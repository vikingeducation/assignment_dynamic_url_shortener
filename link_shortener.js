const redisClient = require("redis").createClient();
const sh = require("shorthash");

function _shortenUrl (url) {
	return `localhost:3000/${sh.unique(url)}`;
}

function storeUrl(url) {
	let shortUrl = _shortenUrl(url);
	redisClient.hsetnx('urlHash', shortUrl, url, (err, result) => {
		if (err) {throw err;}
		if (result) {
			console.log("new field set");
		} else {
			console.log("field already exists");
		}
	})
}

function getUrls() {
	return new Promise((resolve) => {
		redisClient.hgetall('urlHash', (err, data) => {
			return resolve(data);
		})
	})
}

module.exports = {
	storeUrl,
	getUrls
}
