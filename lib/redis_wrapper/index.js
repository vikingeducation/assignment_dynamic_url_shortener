'use strict';

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = require('redis').createClient();

const REDIS_STORE_KEY = 'urls';
const REDIS_URL_COUNT = 'url_count';
const Promise = require('bluebird');

function getUrlCount(longUrl) {
	return redisClient.hgetAsync(REDIS_URL_COUNT, longUrl);
}

function getUrlCounts() {
	return redisClient.hgetallAsync(REDIS_URL_COUNT);
}

function incrementUrlCount(shortUrl) {
	return redisClient.hincrbyAsync(REDIS_URL_COUNT, shortUrl, 1);
}

function saveLink(linkObject) {
	// linkObject should contain the shortened url and original url
	// originalURL
	// shortenedURL
	let { short, long } = linkObject;
	if (short && long) {
		return redisClient.hsetAsync(REDIS_STORE_KEY, short, long);
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
	incrementUrlCount: incrementUrlCount,
	getUrlCount: getUrlCount,
	getUrlCounts: getUrlCounts,
	saveLink: saveLink,
	loadLink: loadLink,
	getAllLinks: getAllLinks
};
