const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const redis = require("redis");
const redisClient = redis.createClient();

function handleUrl(url) {
  return new Promise(resolve => {
    const newUrl = "teenyUrl/" + getRandomString();
    writeRedis(newUrl, url).then(() => {
      resolve(newUrl);
    });
  });
}

function writeRedis(newUrl, url) {
  return new Promise(resolve => {
    redisClient.hmset(newUrl, {
      newUrl: newUrl,
      originalUrl: url,
      visitorCount: 0
    });
    resolve();
  });
}

function getRandomString() {
  var string = "";
  for (let i = 0; i < 6; i++) {
    string = string.concat(chars[Math.floor(Math.random() * 62)]);
  }
  return string;
}

module.exports = { handleUrl };
