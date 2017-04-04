const redisClient = require("redis").createClient();
const sh = require("shorthash");

function _shortenUrl(url) {
  return sh.unique(url);
}

function storeUrl(url) {
  let shortUrl = _shortenUrl(url);
  redisClient.hsetnx("urlHash", shortUrl, url, (err, data) => {
    if (data) {
      redisClient.hsetnx("counterHash", shortUrl, 0, (err, data) => {})
    }
  });
}

function updateCounter(hash) {
  redisClient.hincrby("counterHash", hash, 1, (err, number) => {
    console.log(number);
  }); 
}

function getUrls() {
  return new Promise(resolve => {
    redisClient.hgetall("urlHash", (err, data) => {
      return resolve(data);
    });
  });
}

function getUrl(hash) {
  return new Promise(resolve => {
    redisClient.hget("urlHash", hash, (err, data) => {
      return resolve(data);
    });
  });
}

module.exports = {
  storeUrl,
  getUrls,
  getUrl,
  updateCounter
};