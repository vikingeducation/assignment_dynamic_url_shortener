const redis = require('redis')
const redisClient = redis.createClient()

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

  get: function(url){
    return new Promise((resolve, reject) => {
      redisClient.get(url, function(err, data){
        if (err) reject(err);
        resolve(data);
      })
    });
  },

  shorten: function(url){
    return url
  }
}

module.exports = linkShortener;