const shortid = require('shortid').generate;
const redis = require('redis');
const redisClient = redis.createClient();

function _getPromise(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) reject(err);
      resolve({ key: value });
    });
  });
}

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
    redisClient.LPUSH('idList', id);
  },

  getUrl: function(id) {
    let urlId = 'url' + id;
    // get actual url from redis and return it
    return _getPromise(id);
  },

  getCount: function() {
    return new Promise((resolve, reject) => {
      // get a promise to return our list of ids
      let idListPromise = _getPromise('idList');
      idListPromise
        .then(idListObject => {
          // make a list of promises to return each individual id
          idPromiseArray = idListObject['idList'].map(id => {
            return _getPromise(id);
          });
          // make that list of promises into a list of ids and resolve
          Promise.all(idPromiseArray)
            .then(idArray => {
              resolve(idArray);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

module.exports = shortener;
