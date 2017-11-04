"use strict";

const redis = require("redis");
const client = redis.createClient();

//redis uses database 0 (default)
//to use database 3: client.select(3, function() { ... });

// Quick test here:
// client.set("DC-key", "DC-value", redis.print);
// client.quit();

//hgetall urlKey GHFghf google.com
const writeUrl = (urlKey, originalUrl, shortUrl) => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		//redis hashes are constructed as follows: key, field, value [,field, value, ...]
		//field is overloaded to be an "inner-key" equaling the shortUrl value
		client.hset(urlKey, subKey, originalUrl, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const getUrls = urlKey => {
	return new Promise((resolve, reject) => {
		client.hgetall(urlKey, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

//hget urlKey GXoRF
const getOriginalUrl = (urlKey, shortUrl) => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		client.hget(urlKey, subKey, (err, data) => {
			if (err) reject(err);
			resolve(_formatUrl(data));
		});
	});
};

//hset clickKey dfsa543 0
//hget clickKey dfsa543
//hgetall clickKey
const initCount = (clickKey, shortUrl) => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		client.hset(clickKey, subKey, 0, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const incrementCount = (clickKey, shortUrl) => {
	return new Promise((resolve, reject) => {
		let subKey = shortUrl;
		client.hincrby(clickKey, subKey, 1, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

const getCounts = clickKey => {
	return new Promise((resolve, reject) => {
		client.hgetall(clickKey, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

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

module.exports = {
	writeUrl: writeUrl,
	getUrls: getUrls,
	initCount: initCount,
	incrementCount: incrementCount,
	getCounts: getCounts,
	getOriginalUrl: getOriginalUrl
};
