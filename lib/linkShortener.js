const redis = require('redis');
const redisClient = redis.createClient();
var md5 = require('md5');

var linkShortener = {
  
  getUrlPairs: function() {
    return new Promise((resolve, reject) => {
      redisClient.keys('*', (err, data) => {
      //Some helper function that takes keys and returns an object or key/value pairs
      let urlPairs = [];
      data.forEach((key) => {
        redisClient.hgetall(key, (err, value) => {
          urlPairs.push(
            {
              url: value['url'],
              short: value['short'],
              created: value['created'],
              clicks: value['clicks']
            });
          });
        });
        resolve(urlPairs);
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
    //generate unique id
    //pass back to 
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
    return md5(url).substr(0,5);
  }
}

module.exports = linkShortener;