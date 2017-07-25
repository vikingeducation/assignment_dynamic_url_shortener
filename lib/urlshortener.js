var shortid = require("shortid");
const redis = require("redis");
const redisClient = redis.createClient();

var URLObject = {
  //shorten url with random number
  shortenURL: (url, callback) => {
    redisClient.get("urlKeys", (err, currentKeys) => {
      if (err) throw err;
      currentKeys = JSON.parse(currentKeys) || {};
      let newKey = shortid.generate();

      currentKeys[newKey] = { url: url, count: 0 };
      redisClient.set("urlKeys", JSON.stringify(currentKeys));

      callback();
    });
  },
  GetNewUrl: (url, callback) => {
    redisClient.get("urlKeys", (err, currentKeys) => {
      if (err) throw err;
      currentKeys = JSON.parse(currentKeys);
      console.log(currentKeys[url]);
      newUrl = currentKeys[url]["url"];
      currentKeys[url]["count"]++;
      console.log("redis check");
      redisClient.set("urlKeys", JSON.stringify(currentKeys));
      callback(newUrl);
    });
  },
  retrieveURLs: callback => {
    redisClient.get("urlKeys", function(err, currentKeys) {
      if (err) throw err;

      console.log(currentKeys);
      currentKeys = JSON.parse(currentKeys) || {};

      callback(currentKeys);
    });
  }
};

module.exports = URLObject;
