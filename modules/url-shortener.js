var redis = require("redis");
var client = redis.createClient();

client.on("connect", function() {
	console.log("connected to redis");
});

//wrapper
var shortener = {};

function makeId() {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

//store shortend url
shortener.shorten = function(url) {
	var id = makeId();

	client.hmset(id, {
		url: url,
		clicks: 0
	});

	return id;
};

//get the stored info
shortener.queryForUrls = function(id) {
	return new Promise((resolve, reject) => {
		client.hgetall(id, (err, reply) => {
			if (err) {
				reject(err);
			}
			resolve(reply);
		});
	});
};

//ANOTHER FUNCTION TO GET ALL KEYS (IDS)
shortener.getAllKeys = function() {
	return new Promise((resolve, reject) => {
		client.keys("*", (err, reply) => {
			if (err) {
				reject(err);
			}
			resolve(reply);
		});
	});
};

shortener.buildObjforRender = function() {
	return new Promise((resolve, reject) => {
		var allUrlDataArr = [];
		shortener
			.getAllKeys()
			.then(keys => {
				if (keys.length >= allUrlDataArr.length) {
					resolve(allUrlDataArr);
				}
				keys.forEach(function(key) {
					shortener
						.queryForUrls(key)
						.then(hashObj => {
							var objBuilder = {
								key: key,
								url: hashObj.url,
								clicks: hashObj.clicks
							};
							console.log("obj", objBuilder);
							allUrlDataArr.push(objBuilder);
						})
						.catch(err => {
							if (err) {
								console.error(err);
							}
						});
				});
			})
			.catch(err => {
				if (err) {
					console.error(err);
				}
			});
	});
};

//runs everrytime GET '/'

/*
shortener.buildObjforRender = function() {
	return new Promise((resolve, reject) => {
		var allUrlDataArr = [];
		shortener
			.getAllKeys()
			.then(keys => {
				keys.forEach(function(key) {
					shortener
						.queryForUrls(key)
						.then(hashObj => {
							var objBuilder = {
								key: key,
								url: hashObj.url,
								clicks: hashObj.clicks
							};
							console.log("obj", objBuilder);
							allUrlDataArr.push(objBuilder);
						})
						.catch(err => {
							if (err) {
								console.error(err);
							}
						});
				});
				resolve(allUrlDataArr);
			})
			.catch(err => {
				if (err) {
					console.error(err);
				}
			});
	});
};*/

//iteratecount

module.exports = shortener;
