const redis = require("redis");
const redisClient = redis.createClient();
var io = require("../app.js");

/* TESTING */

//make a new hash
//client.hmset(hash, obj[, callback]) other signature
function makeHash(hashName, obj) {
  var p = new Promise(resolve => {
    redisClient.hmset(hashName, obj, (err, data) => {
      resolve(data);
    });
  });
  return p;
}

//read an entire  hash
function readHash(hashName) {
  var p = new Promise(resolve => {
    redisClient.hgetall(hashName, (err, data) => {
      //console.log(data);
      resolve(data);
    });
  });
  return p;
}

//increment a value in a hash
function incrHash(hashName, key, amount) {
  var p = new Promise(resolve => {
    redisClient.hincrby(hashName, key, amount, (err, data) => {
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
