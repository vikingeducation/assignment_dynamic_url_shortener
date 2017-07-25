const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = require('redis').createClient();

const REDIS_STORE_KEY = 'urls';
const REDIS_URL_COUNT = 'url_count'
const Promise = require('bluebird')

function init() {
	return new Promise((resolve, reject) => {
		redisClient.hset(REDIS_STORE_KEY, _handleInit(err, res))
	  redisClient.hset(REDIS_URL_COUNT, _handleInit(err, res))
	});
}

function _handleInit(err, res){
	if (err) reject(err);
	resolve(res);
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
