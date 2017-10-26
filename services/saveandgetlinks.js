const redis = require('redis');
const redisClient = redis.createClient();

const getAllLinks = () => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall('urls', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getLink = (link) => {
  console.log(link)
  return new Promise((resolve, reject) => {
    redisClient.hget('urls', link, (err, value) => {
      if (err) {
        reject(err);
      } else {
        console.log("value", value)
        resolve(value);
      }
    });
  });
};

const saveLink = (url) => {
  let shortlink = createRandom();
  redisClient.hset('urls', shortlink, url);
};


const createRandom = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

module.exports = {
  getLink,
  getAllLinks,
  saveLink
}
