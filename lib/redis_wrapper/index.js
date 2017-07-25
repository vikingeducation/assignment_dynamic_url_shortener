const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = require('redis').createClient();

const REDIS_STORE_KEY = 'urls';
const REDIS_URL_COUNT = 'url_count';
const Promise = require('bluebird');

function init() {
	return new Promise(resolve => {
		redisClient.hset(REDIS_STORE_KEY);
		redisClient.hset(REDIS_URL_COUNT);
		resolve(true);
	});
}

function saveLink(linkObject) {
	// linkObject should contain the shortened url and original url
	// originalURL
	// shortenedURL
	let { short, long } = linkObject;
	if (short && long) {
		redisClient.hset(REDIS_STORE_KEY, short, long);
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
