// const redisClient = require("redis").createClient();
const redis = require("redis");
// const Promise = require('bluebird');

// Promise.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = {
	storeData: (objStorage) => {
		return new Promise((resolve, reject) => {
			redisClient.hset(objStorage, (err, data) => {
				if (err) {
					console.log('here???')
					console.error(err);
					reject(err);
				}

				resolve(data);
	  	})
		})


	},

	getData: (id) => {
		return new Promise((resolve, reject) => {
			redisClient.hkeys(id, (err, data) => {
				if (err) {
					console.log('here???')
					console.error(err);
					reject(err);
				}
				
				resolve(data);
			})
		})


	}
}

// if (!err && data) {
// 				console.log('this is the data', data);
// 			} else {
// 				console.log(data);
// 				console.log(err);
// 				console.error('oh no!');
// 			}
