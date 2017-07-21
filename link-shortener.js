const redis = require('redis');
const redisClient = redis.createClient();

const setShortenedLink = url => {
  let shortenedLink = shortenLink(url);
  // redisClient.set(url, shortenedLink, redis.print);
  redisClient.hset('urls', url, shortenedLink);
  // console.log(url + ", " + shortenedLink);
};

//promise based implementation
const getShortenedLink = url => {
  return new Promise((resolve, reject) => {
    redisClient.hget('urls', url, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
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
        // console.log(data);
        resolve(data);
      }
    });
  });
};

//accepts url and returns abbreviated url
const shortenLink = url => {
  var shortenedURL = url.split('').filter((char, index) => {
    if (index % 3 === 0) {
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
  getShortenedLink,
  getAllURLs
};
