const shortID = require('shortid');
const redisClient = require('redis').createClient();


const makeShortenedURL = (longURL) => {
  return new Promise((resolve, reject) => {
    const shortenedURL = shortID(longURL);

    redisClient.hmset(shortenedURL, {
      shortenedURL,
      longURL,
      visits: 0
    });

    redisClient.rpush('urls', shortenedURL, (err, reply) => {
      resolve();
    });
  });
};

const getURLs = () => {
  return new Promise((resolve, reject) => {
    redisClient.lrange('urls', 0, -1, (err, data) => {
      if (err) {
        throw err;
      }

      resolve(data);
    });
  });
};

const getFullURL = (id) => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(id, (err, obj) => {
      if (err) {
        throw err;
      }

      resolve(obj);
    });
  })
};


module.exports = {
  makeShortenedURL,
  getURLs,
  getFullURL
}
