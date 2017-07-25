const redisClient = require("redis").createClient();

module.exports = {
	storeData: (id, objStorage) => {
	  redisClient.hset(objStorage, () => {
	    console.log("Data stored!");
	  })
	},

	getData: (id) => {
		redisClient.hkeys(id, (err, data) => {
			if (!err && data) {
				console.log('this is the data', data);
			} else {
				console.log(data);
				console.log(err);
				console.error('oh no!');

			}
		})
	}
}
