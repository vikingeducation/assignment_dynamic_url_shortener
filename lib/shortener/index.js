const redis = require('redis');
const redisClient = redis.createClient();

let shortener = {
  updateUrl: function(urlId) {

    // increment the count
    // return the count
  },
  shorten: function(url) {
    // create id
    // initialize the counter
    // store the actual url in redis keyed by the id
    // return id
  },
  getUrl: function(urlId) {
    // get actual url from redis and return it
  }
};

module.exports = shortener;

// Redis structure
{
  adfadf: {
    count: 2,
    url: 'http://adsfasdfa'
  }
}
