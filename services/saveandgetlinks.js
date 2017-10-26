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

const getLink = (url) => {
  console.log(url)
  return new Promise((resolve, reject) => {
    redisClient.hget('urls', url, (err, value) => {
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
  redisClient.hset('counts', shortlink, 0);
  return shortlink
};

const increment = url => {
  return new Promise((resolve, reject) => {
    redisClient.hincrby('counts', url, 1, (err, count) => {
        console.log("count from increment function", count)
        resolve(count);
      })
    });
}

const getCounts = () => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall('counts', (err, counts) => {
        console.log("counts", counts)
        resolve(counts);
      })
    });
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
  saveLink,
  increment,
  getCounts
}
