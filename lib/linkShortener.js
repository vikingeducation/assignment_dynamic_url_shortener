const redis = require('redis');
const redisClient = redis.createClient();
var md5 = require('md5');

var linkShortener = {
  checkUrl: function(url){
    return new Promise((resolve, reject) => {
      redisClient.exists(url, function(err, data){
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  set: function(url){
    let shortUrl = linkShortener.shorten(url)
    redisClient.hset(url, 'url', url);
    redisClient.hset(url, 'created', new Date);
    redisClient.hset(url, 'clicks', 0);
    redisClient.hset(url, 'short', shortUrl);
  },

  get: function(url){
    return new Promise((resolve, reject) => {
      redisClient.hget(url, function(err, data){
        if (err) reject(err);
        resolve(data);
      })
    });
  },

  shorten: function(url){
    return md5(url).substr(0,5);
  }
}

module.exports = linkShortener;