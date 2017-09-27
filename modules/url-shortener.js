var redis = require("redis");
var client = redis.createClient();

const shortener = {};

function makeId() {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

//store shortend url //shorten a url
shortener.shorten = function(url) {
	var id = makeId();

	client.hmset("urls", {
		url: url,
		id: id,
		clicks: 0
	});

	return id;
};

//get the stored info
shortener.queryForUrls = function() {
	var allUrlData = new Promise((resolve, reject) => {
		client.hgetall("urls", (err, reply) => {
			if (err) reject(err);

			resolve(reply);
		});
	});
};

//iteratecount
