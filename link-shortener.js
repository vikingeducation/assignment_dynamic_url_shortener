const redis = require('redis');
const redisClient = redis.createClient();

const setShortenedLink = (url) => {
  let shortenedLink = shortenLink(url);
  redisClient.set(url, shortenedLink, redis.print);
  // console.log(url + ", " + shortenedLink);
};

//promise based implementation
const getShortenedLink = (url) => {
  return new Promise((resolve, reject) => {
    redisClient.get(url, (err, value) => {
      if (err) {
        reject(err)
      } else {
        resolve(value)
      }
    });
  });
};

//accepts url and returns abbreviated url
const shortenLink = (url) => {
  var shortenedURL = url.split("").filter( (char, index) => {
    if (index % 3 === 0) {
      return char;
    }
  });
  return shortenedURL.join("");
}

var url = "googlefacebookmyspace";
var fakeUrl = "notinthedatabaseyet"
console.log("base url: " + url);
setShortenedLink(url);
getShortenedLink(fakeUrl).then( value => {
  console.log(value);
}).catch(err => {
  console.err(err);
});

module.exports = {
  setShortenedLink,
  getShortenedLink
};
