const redis = require("redis");
const redisClient = redis.createClient();

/* TESTING */

//make a new hash
//client.hmset(hash, obj[, callback]) other signature
function makeHash(hash_name, obj) {
  var p = new Promise(resolve => {
    redisClient.hmset(hash_name, obj, (err, data) => {
      resolve(data);
    });
  });
  return p;
}

//read an entire  hash
function readHash(hash_name) {
  var p = new Promise(resolve => {
    redisClient.hgetall(hash_name, (err, data) => {
      //console.log(data);
      resolve(data);
    });
  });
  return p;
}
//increment a value in a hash
function incrHash(hash_name, key, amount) {
  var p = new Promise(resolve => {
    redisClient.hincrby(hash_name, key, amount, (err, data) => {
      console.log(`increment data ${data}`);
      resolve(data);
    });
  });
  return p;
}

module.exports = {
  incrHash,
  readHash,
  makeHash
};
