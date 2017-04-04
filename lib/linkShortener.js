const redis = require('redis');
const redisClient = redis.createClient();

function linkShortener(originalUrl) {
  let shortenedUrl = _makeId(originalUrl);
  redisClient.hsetnx(shortenedUrl, url, originalUrl, count, 0);
  // uadsfoj: {url: original, count: 0}
}

function _makeId(str) {
  let result = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
}

module.exports = linkShortener;
