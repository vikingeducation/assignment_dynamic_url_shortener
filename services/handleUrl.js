const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const redis = require("redis");
const redisClient = redis.createClient();

function handleUrl(url) {
  const newUrl = "teenyUrl/" + getRandomString();
  writeRedis(newUrl, url).then(() => {
    return newUrl;
  });
}

function writeRedis(newUrl, url) {
  return new Promise(resolve => {
    console.log(newUrl);
    redisClient.hmset(newUrl, ["originalUrl", url]);
    redisClient.hincrby(newUrl, "visitor-count", 1);
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
