const redisClient = require('redis').createClient();

function _getter(shortUrl) {
  return new Promise((resolve, reject) => {
    redisClient.hget('urlHash', shortUrl, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply);
    });
  });
}

function _setter(shortUrl, originalUrl) {
  return new Promise((resolve, reject) => {
    redisClient.hsetnx('urlHash', shortUrl, originalUrl, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply);
    });
  });
}

function _getAll() {
  return new Promise((resolve, reject) => {
    redisClient.hgetall('urlHash', (err, object) => {
      if (err) {
        reject(err);
      }
      resolve(object);
    });
  });
}

const _formatUrlObject = (urlObject) => {
  const entries = Object.entries(urlObject);
  const formattedUrlObject = {};
  entries.forEach((entry, index) => {
    formattedUrlObject[index] = {
      long: entry[1],
      short: entry[0],
    };
  });
  return formattedUrlObject;
};

async function getUrl(shortUrl, callback) {
  const originalUrl = await _getter(shortUrl);
  callback(originalUrl);
}

async function setUrl(originalUrl, callback) {
  let shortPath;
  let reply = 0;
  while (reply !== 1) {
    // get 5 random characters from set [a-z0-9]
    shortPath = (Math.random() + 1).toString(36).substr(2, 5);
    reply = await _setter(shortPath, originalUrl);
  }
  callback(shortPath);
}

async function getAllUrls(callback) {
  const urlObject = await _getAll();
  const formattedUrlObject = _formatUrlObject(urlObject);
  callback(formattedUrlObject);
}

module.exports = { getUrl, setUrl, getAllUrls };
