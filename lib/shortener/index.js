const shortid = require('shortid').generate;
const redis = require('./redis_wrapper');
const env = require('../../env');

let shortener = {
  // Add a given url to the redis store
  // return promises that resolve to the url and count objects
  shorten: function(url) {
    // Create id
    let id = shortid();
    // Insert url and count into hashes
    let urlPromise = redis.set('urls', id, url);
    let countPromise = redis.set('counts', id, 0);
    return Promise.all([urlPromise, countPromise]);
  },

  // Increment the count for a given id,
  // Return promises resolve to url and count objects
  update: function(id) {
    // Get url
    let urlPromise = redis.get('urls', id);
    // Increment counter
    let countPromise = redis.incr('counts', id, 1);
    return Promise.all([urlPromise, countPromise]);
  },

  // Return a list of objects representing each shortened url
  retrieve: function(req) {
    // Get counts and urls
    let allCountsPromise = redis.getAll('counts');
    let allUrlsPromise = redis.getAll('urls');

    return new Promise((resolve, reject) => {
      Promise.all([allCountsPromise, allUrlsPromise])
        .then(([countsObj, urlsObj]) => {
          // Build a list of url objects
          let urls = [];
          for (let id in countsObj) {
            // Qualify our local links
            let qualified = `http://${req.hostname}:${env.port}/${id}`;
            urls.push({
              url: qualified,
              count: countsObj[id],
              originalUrl: urlsObj[id],
              id: id
            });
          }
          // Pass our list of objects
          resolve(urls);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

module.exports = shortener;
