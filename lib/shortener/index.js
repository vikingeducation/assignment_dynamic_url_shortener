
const shortid = require('shortid').generate;


function _getPromise (key) {
  return new Promise((resolve, reject) =>{
    redisClient.get(key, (err, value) =>{
      if err reject(err);
      resolve(value);
      }) 
    }
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
      let idListPromise = _getPromise('idList');
      idListPromise.then(idList
        }
      } 

    )
  })
  }
}

module.exports = shortener;
