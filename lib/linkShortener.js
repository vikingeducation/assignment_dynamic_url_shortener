const redis = require('redis');
const redisClient = redis.createClient();

function linkShortener(originalUrl) {
  let shortenedUrl = _makeId(originalUrl);
  // while (redisClient.exists(shortenedUrl)) {
  //   shortenedUrl = _makeId(originalUrl);
  // }
  let hmset = redisClient.hmset(shortenedUrl, 'url', originalUrl, 'count', 0);
  return new Promise(resolve => {
    redisClient.hmget(shortenedUrl, 'url', 'count', (err, data) => {
      resolve(data);
    });
  });

  // return redisClient.hmget(shortenedUrl, 'url', 'count');
  //return [originalUrl, countNum]
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
