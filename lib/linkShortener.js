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
    redisClient.set(url, `http://localhost:3000/${shortUrl}`);
  },

  setPair: function(key, value){
    redisClient.set(key, value );
  },

  get: function(url){
    return new Promise((resolve, reject) => {
      redisClient.get(url, function(err, data){
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