const shortid = require('shortid').generate;
const redis = require('redis');
const redisClient = redis.createClient();

// Given a site id and hash name
// return a promise that is passed the value associate with that name
function _hashGet(hash, key) {
  return new Promise((resolve, reject) => {
    redisClient.hget(hash, key, (err, value) => {
      if (err) reject(err);
      resolve(value);
    });
  });
}

let shortener = {
  // Increment the count for a given id,
  // Return a promise that is passed the url
  updateUrl: function(id) {
    // Increment async
    redisClient.hincrby('counts', id, 1);
    // Return url
    return _hashGet('urls', id);
  },

  // Add a given url to the redis store, return its id
  shorten: function(url) {
    // Create id
    let id = shortid();
    // Insert url and count into hashes
    redisClient.hset('urls', id, url);
    redisClient.hset('counts', id, 0);
    return id;
  },

  // Return a list of objects
  // [{id: clicks}...]
  getAllCounts: function() {
    return new Promise((resolve, reject) => {
      redisClient.hgetall('counts', (err, counts) => {
        if (err) reject(err);
        resolve(counts);
      });
    });
  }
};

module.exports = shortener;
