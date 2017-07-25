var shortid = require("shortid");
const redis = require('redis')
const redisClient = redis.createClient()

test = {
	shortenURL: (url, callback) => {
		newKey = shortid.generate();
		redisClient.set(newKey, url);

		callback(newKey);
	},

	retrieveURL: (shortUrl, callback) => {
		redisClient.get(shortUrl, function(err, url) {
			if (err) throw err;

			callback(url);
		});
	}
}

test.shortenURL("this is a test", function(newKey) {
	test.retrieveURL(newKey, function(url) {
		console.log(newKey);
		console.log(url);
	});
});