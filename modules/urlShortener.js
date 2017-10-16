const redisClient = require("redis").createClient();
const shortHash = require("shorthash");

redisClient.del("urls");


function shortenURL(url) {
  let shortURL = shortHash.unique(url);
  redisClient.hmset(shortURL, {
    "shortURL": shortURL,
    "longURL": url,
    "count": "0"
  });
  redisClient.rpush("urls", shortURL);
  return shortURL;
}

function getAllURLs() {
  return new Promise(function(resolve, reject) {
    redisClient.lrange("urls", 0, -1, function(err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });

}

function getLongURL(url) {
  return new Promise(function(resolve, reject) {
      redisClient.hgetall(url, function (err, data) {
        if (err) reject(err);
        resolve(data);
      });
    })
  };


function incrementCount(url) {
  redisClient.hincrby(url, "count", 1);
}

module.exports = {
  shortenURL,
  getAllURLs,
  getLongURL,
  incrementCount
};
