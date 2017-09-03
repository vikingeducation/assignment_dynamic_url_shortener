const redis = require("redis");
const redisClient =
  typeof process.env.REDIS_URL === "undefined"
    ? redis.createClient()
    : redis.createClient(process.env.REDIS_URL);

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
