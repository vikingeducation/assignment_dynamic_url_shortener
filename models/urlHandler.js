const redisClient = require('redis').createClient();

function _getter(shortUrl) {
  return new Promise((resolve, reject) => {
    redisClient.get(shortUrl, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply);
    });
  });
}

function _setter(shortUrl, originalUrl) {
  return new Promise((resolve, reject) => {
    redisClient.setnx(shortUrl, originalUrl, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply);
    });
  });
}

async function getUrl(shortUrl, callback) {
  const originalUrl = await _getter(shortUrl);
  callback(originalUrl);
}

async function setUrl(originalUrl, callback) {
  let shortUrl;
  let reply = 0;
  while (reply !== 1) {
    shortUrl = Math.random()
      .toString(36)
      .substr(2, 5);
    reply = await _setter(shortUrl, originalUrl);
  }
  callback(shortUrl);
}

module.exports = { getUrl, setUrl };
