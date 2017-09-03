// const redis = require("redis");
// var redisClient =
//   typeof process.env.REDIS_URL === "undefined"
//     ? redis.createClient()
//     : redis.createClient(process.env.REDIS_URL);

if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}

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
