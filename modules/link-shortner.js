const redisClient = require("redis").createClient();

var redisClientObject = {
  setSite: function(siteName, shortenSiteName) {
    redisClient.LPUSH("shortenSites", [shortenSiteName]);
    redisClient.LPUSH("fullSites", [siteName]);
    redisClient.LPUSH("siteClicks", 0);
  },

  getShortenSites: function() {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE("shortenSites", 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  },
  getFullSites: function() {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE("fullSites", 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  },

  getClickSites: function() {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE("siteClicks", 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  },

  increaseClickSite: function (index, value) {
    redisClient.LSET("siteClicks", index, (Number(value) + 1));
  }
}


module.exports = redisClientObject;
