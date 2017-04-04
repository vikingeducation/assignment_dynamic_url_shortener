const redis = require("redis");
const redisClient = redis.createClient();

function linkShortener(originalUrl) {
  let shortUrl = _makeId(originalUrl);
  let hmset = redisClient.hmset(shortUrl, {
    url: originalUrl,
    count: 0,
    date: Date.now()
  });
  return shortUrl;
}

// return redisClient.hmget(shortenedUrl, 'url', 'count');
//return [originalUrl, countNum]
// uadsfoj: {url: original, count: 0}

function getInfo(shortUrl) {
  return new Promise(resolve => {
    redisClient.hmget(shortUrl, "url", "count", "date", (err, data) => {
      resolve(data);
    });
  });
}

function incrementCount(shortUrl) {
  redisClient.hincrby(shortUrl, "count", 1, (err, count) => {});
}

function flush() {
  redisClient.flushall();
}

function _makeId(str) {
  let result = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
}

function getKeys() {
  return new Promise(resolve => {
    redisClient.keys("*", (err, data) => {
      resolve(data);
    });
  });
}

function createUrls(keys) {
  let infoArrays = keys.map(key => getInfo(key));
  return Promise.all(infoArrays).then(arrays => {
    return new Promise(resolve => {
      let allUrls = [];
      for (let i = 0; i < keys.length; i++) {
        allUrls.unshift({
          short: keys[i],
          original: arrays[i][0],
          count: arrays[i][1],
          date: arrays[i][2]
        });
      }
      resolve(allUrls);
    });
  });
}

module.exports = {
  flush,
  getKeys,
  linkShortener,
  getInfo,
  createUrls,
  incrementCount
};
