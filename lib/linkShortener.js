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
    // we'll take in something like www.google.com
    // we want to auto-generate a string of characters that maps www.google.com to => xdlkj54SDdj
    // we want to append this to the end of `localhost:3000/`
    // the final redis store will look like: { www.google.com: 'localhost:3000/xdlkj54SDdj' }
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