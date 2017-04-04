var redisClient = require('./redisClient');
var md5 = require('md5');

var linkShortener = {

  getUrlPairs: function() {
    return new Promise((resolve, reject) => {
      redisClient.keys('*', (err, data) => {
      //Some helper function that takes keys and returns an object or key/value pairs
      let urlPairs = [];
      if(data.length === 0) resolve(urlPairs);
      data.forEach((key) => {
        redisClient.hgetall(key, (err, value) => {
          urlPairs.push(
            {
              url: value['url'],
              short: value['short'],
              created: value['created'],
              clicks: value['clicks']
            });
          if(data.length === urlPairs.length){
            resolve(urlPairs);
          }
          });
        });
      });
    });
  },



  exists: function(uniqueID){
    return new Promise((resolve, reject) => {
      redisClient.exists(uniqueID, function(err, data){
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  set: function(url){
    let uniqueID = linkShortener.shorten(url);
    redisClient.hset(uniqueID, 'url', url);
    redisClient.hset(uniqueID, 'created', new Date);
    redisClient.hset(uniqueID, 'clicks', 0);
    redisClient.hset(uniqueID, 'short', uniqueID);
  },

  hget: function(key, value){
    return new Promise((resolve, reject) => {
      redisClient.hget(key, value, function(err, data){
        if (err) reject(err);
        resolve(data);
      });
    });
  },

  shorten: function(url){
    return Date.now();
  }
}

module.exports = linkShortener;