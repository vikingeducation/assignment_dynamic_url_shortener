var shortid = require("shortid");
const redis = require("redis");
const redisClient = redis.createClient();

var URLObject = {
  //shorten url with random number
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
};

module.exports = URLObject;
