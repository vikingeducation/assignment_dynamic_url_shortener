// const redisClient = require("redis").createClient();
const redis = require("redis");
// const Promise = require('bluebird');

// Promise.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = {
  storeData: (id, objStorage) => {
    return new Promise((resolve, reject) => {
      redisClient.hmset(id, objStorage, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  getData: id => {
    return new Promise((resolve, reject) => {
      redisClient.hgetall(id, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  getAllKeys: () => {
    return new Promise((resolve, reject) => {
      redisClient.keys("*", (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
};
