const shortID = require('shortid');
const redisClient = require('redis').createClient();


const makeShortenedURL = (longURL) => {
  return new Promise((resolve, reject) => {
    const shortenedURL = shortID(longURL);

    redisClient.hmset('urls', shortenedURL, longURL, (err, reply) => {
      if (err) {
        throw err;
      }

      resolve(reply);
    });
  });
};

const getURLs = () => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall('urls', (err, obj) => {
      if (err) {
        throw err;
      }

      resolve(obj);
    });
  });
}




module.exports = {
  makeShortenedURL,
  getURLs,
}
