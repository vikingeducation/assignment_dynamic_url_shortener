var shortid = require("shortid");
const redis = require("redis");
const redisClient = redis.createClient();

var URLObject = {
  //shorten url with random number
  shortenURL: (url) => {
    if (!redisClient.exists("urlKeys")) {
      redisClient.set("urlKeys", "{}");
    }

    redisClient.get("urlKeys", (err, currentKeys) => {
      if (err) throw err;
      console.log(currentKeys);
      currentKeys = JSON.parse(currentKeys);
      let newKey = shortid.generate();

      currentKeys[newKey] = url;
      redisClient.set("urlKeys", JSON.stringify(currentKeys));
    });
  },

  retrieveURLs: (callback) => {
    if (!redisClient.exists("urlKeys")) {
      redisClient.set("urlKeys", JSON.stringify({}));
    }

    redisClient.get("urlKeys", function(err, currentKeys) {
      if (err) throw err;

      console.log(currentKeys);
      currentKeys = JSON.parse(currentKeys);
    
      callback(currentKeys);
    });
  }
};

module.exports = URLObject;
