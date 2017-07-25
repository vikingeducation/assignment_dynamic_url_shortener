const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = require('redis').createClient();

const REDIS_STORE_KEY = 'urls';

function init() {
	return new Promise((resolve, reject) => {
		redisClient.hsetnx('urls', 'testLong', 'testShort', (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});
}

function saveLink(linkObject) {
	// linkObject should contain the shortened url and original url
	// originalURL
	// shortenedURL
	let { short, long } = linkObject;
	if (short && long) {
		redisClient.hset(REDIS_STORE_KEY, long, short);
		return true;
	} else {
		console.error('missing params');
		return false;
	}
}

function loadLink(originalURL) {
	return redisClient.hgetAsync(REDIS_STORE_KEY, originalURL);
}

function getAllLinks() {
	return redisClient.hgetallAsync(REDIS_STORE_KEY);
}

module.exports = {
	init: init,
	saveLink: saveLink,
	loadLink: loadLink,
	getAllLinks: getAllLinks
};
