const redis = require('redis');
const redisClient = redis.createClient();
// const url = require('url');

const setShortenedLink = url => {
  let shortenedLink = shortenLink(url);
  // redisClient.hset('urls', url, shortenedLink);
  redisClient.hset('urls', shortenedLink, url);
  redisClient.hset('counts', shortenedLink, 0);
};

// promise based implementation
const getURL = link => {
  return new Promise((resolve, reject) => {
    redisClient.hget('urls', link, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
};

const incrementCount = url => {
  return new Promise((resolve, reject) => {
    redisClient.hincrby('counts', url, 1, (err, count) => {
      if (err) {
        rejefct(err);
      } else {
        resolve(count);
      }
    });
  });
};

const getAllURLs = () => {
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

const getAllCounts = () => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall('counts', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//accepts url and returns abbreviated url
const shortenLink = url => {
  var shortenedURL = url.split('').filter((char, index) => {
    if (index % 3 === 0 && char !== '/') {
      return char;
    }
  });
  return shortenedURL.join('');
};

// var url = 'googlefacebookmyspace';
// var fakeUrl = 'notinthedatabaseyet';
// setShortenedLink(url);
// setShortenedLink(fakeUrl);
// getShortenedLink(fakeUrl)
//   .then(value => {
//     console.log(value);
//   })
//   .catch(err => {
//     console.err(err);
//   });
// getAllURLs();
// .then(value => {
//   console.log(value);
// })
// .catch(err => {
//   console.err(err);
// });

module.exports = {
  setShortenedLink,
  getURL,
  getAllURLs,
  getAllCounts,
  incrementCount
};
