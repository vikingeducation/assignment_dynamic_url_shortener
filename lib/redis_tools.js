const redisClient = require("redis").createClient();

module.exports = {
	storeData: (id, url) => {
	  redisClient.set(id, url, () => {
	    console.log("Data stored!");
	  })
	},

	getData: (id) => {
		redisClient.get(id, (err, data) => {
			if (!err && data) {
				console.log('this is the data', data);
				console.log(typeof data, 'data');
				console.log(JSON.parse(data), 'what this')
			} else {
				console.error('oh no!');
			}
		})
	}
}

