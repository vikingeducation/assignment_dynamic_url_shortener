const redis = require('redis');
const redisClient = redis.createClient();
const shortid = require('shortid').generate;

let shortener = {
  updateUrl: function(id) {
    return new Promise((reject, resolve) =>{
    // increment the count
      redisClient.incr(id, (err, count)=> {
    // return the count or err
        if (err) reject(err);
        else resolve(count)
      })
    })
  },
  shorten: function(url) {
    // create id
    let id = shortid();
    let urlId = 'url' + id
    // initialize the counter
    redisClient.setnx(id, 1);
    // store the actual url in redis keyed by the id
    redisClient.setnx(urlId, url);
    redisClient.LPUSH('urlList', id);
    // return id
    return id;
  },
  getUrl: function(id) {
    let urlId = 'url' + id
    // get actual url from redis and return it
    return new Promise( (resolve, reject) => {
      redisClient.get(urlId, (err, url) => {
        if (err) reject(err);
        else resolve(url)
      }
    }) 
  }
};

module.exports = shortener;

// Redis structure
// {
//   adfadf: {
//     count: 2,
//     url: 'http://adsfasdfa'
//   }
// }
