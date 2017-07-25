const redis = require('redis');
const redisClient = redis.createClient();
const shortid = require('shortid').generate;

let shortener = {
  updateUrl: function(id) {
    // increment counter async
    redisClient.incr(id, (err, count) => {
      if (err) console.error(err.stack);
    });
    // return getUrl promise
    return shortener.getUrl(id);
  },

  shorten: function(url) {
    // create id
    let id = shortid();
    let urlId = 'url' + id;
    // initialize the counter
    redisClient.setnx(id, 1);
    // store the actual url in redis keyed by the id
    redisClient.setnx(urlId, url);
    // add the new id to the list
    redisClient.LPUSH('urlList', id);
  },

  getUrl: function(id) {
    let urlId = 'url' + id;
    // get actual url from redis and return it
    return new Promise((resolve, reject) => {
      redisClient.get(urlId, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
  }
};

module.exports = shortener;
