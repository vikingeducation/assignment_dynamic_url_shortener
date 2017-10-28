const redisClient = require('redis').createClient();

function _getPathList() {
  return new Promise((resolve, reject) => {
    redisClient.lrange('pathList', 0, -1, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply);
    });
  });
}

function getUrlObject(shortPath) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(shortPath, (err, reply) => {
      if (err) reject(err);
      resolve(reply);
    });
  });
}

function setUrlObject(originalUrl) {
  let shortPath;
  let reply = 1;
  while (reply === 1) {
    // get 5 random characters from set [a-z0-9], check if shortPath already exists in database
    shortPath = (Math.random() + 1).toString(36).substr(2, 5);
    reply = redisClient.exists(shortPath);
  }
  redisClient.hmset(shortPath, 'short', shortPath, 'long', originalUrl, 'clicks', 0);
  redisClient.lpush('pathList', shortPath);
  return shortPath;
}

async function getAllUrlObjects(callback) {
  const pathList = await _getPathList();
  const urlObjects = [];
  pathList.forEach((path) => {
    getUrlObject(path).then((urlObject) => {
      urlObjects.push(urlObject);
    });
  });
  callback(urlObjects);
}

function incrementClicks(shortPath) {
  redisClient.hincrby(shortPath, 'clicks', 1);
}

module.exports = {
  getUrlObject,
  setUrlObject,
  getAllUrlObjects,
  incrementClicks,
};
