"use strict";

const redis = require("redis");
const client = redis.createClient();
const APP_URL_KEY = "urlKey";
const APP_CLICK_KEY = "clickKey";

//redis uses database 0 (default)
//to use database 3: client.select(3, function() { ... });

// Quick test here:
// client.set("DC-key", "DC-value", redis.print);
// client.quit();

const _formatUrl = url => {
	const HTTP_PROTOCOL = "http://";
	const SECURE_HTTP_PROTOCOL = "https://";
	const httpTest = url.substr(0, HTTP_PROTOCOL.length);
	const httpsTest = url.substr(0, SECURE_HTTP_PROTOCOL.length);

	if (httpTest !== HTTP_PROTOCOL) {
		if (httpsTest !== SECURE_HTTP_PROTOCOL) {
			url = HTTP_PROTOCOL + url;
		}
	}
	return url;
};

//check redis database: hgetall urlKey GHFghf google.com
const writeUrl = (originalUrl, shortUrl) => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		//redis hashes are constructed as follows: key, field, value [,field, value, ...]
		//field is overloaded to be an "inner-key" equaling the shortUrl value
		client.hset(APP_URL_KEY, subKey, originalUrl, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const getUrls = () => {
	return new Promise((resolve, reject) => {
		client.hgetall(APP_URL_KEY, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

//hget urlKey GXoRF
const getOriginalUrl = shortUrl => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		client.hget(APP_URL_KEY, subKey, (err, data) => {
			if (err) reject(err);
			resolve(_formatUrl(data));
		});
	});
};

//check redis database: hset clickKey dfsa543 0
//check redis database: hget clickKey dfsa543
//check redis database: hgetall clickKey
const initCount = shortUrl => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		client.hset(APP_CLICK_KEY, subKey, 0, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const incrementCount = shortUrl => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		client.hincrby(APP_CLICK_KEY, subKey, 1, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const getCounts = () => {
	return new Promise((resolve, reject) => {
		client.hgetall(APP_CLICK_KEY, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

module.exports = {
	writeUrl: writeUrl,
	getUrls: getUrls,
	initCount: initCount,
	incrementCount: incrementCount,
	getCounts: getCounts,
	getOriginalUrl: getOriginalUrl
};
