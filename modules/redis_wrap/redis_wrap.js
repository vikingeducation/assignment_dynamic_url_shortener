const redis = require("redis");
const redisClient = redis.createClient();

/* TESTING */

//make a new hash
//client.hmset(hash, obj[, callback]) other signature
function make_hash(hash_name, obj) {
  var p = new Promise(resolve => {
    redisClient.hmset(hash_name, obj, (err, data) => {
      resolve(data);
    });
  });
  return p;
}

//read an entire  hash
function read_hash(hash_name) {
  var p = new Promise(resolve => {
    redisClient.hgetall(hash_name, (err, data) => {
      //console.log(data);
      resolve(data);
    });
  });
  return p;
}
// increment a value in a hash
function incr_hash(hash_name, key, amount) {
  var p = new Promise(resolve => {
    redisClient.hincrby(hash_name, key, amount, (err, data) => {
      console.log(`increment data ${data}`);
      resolve(data);
    });
  });
  return p;
}

function test() {
  /*redisClient.hgetall("test", (err, data) => {
    console.log(data);
  });*/
  make_hash("new_hash", {
    originalUrl: "http://github.com",
    shortUrl: "http://cashcats.biz/",
    clicks: 10
  });
  read_hash("new_hash");
  //increment clicks
  incr_hash("new_hash", "clicks", "10");
  read_hash("new_hash");
  /*
  make_hash("test_hash", "users", "1").then(message => {
    var data = read_hash("test_hash", "users");
    console.log(`Data of test is ${data}`);
  });*/
}
//test();

module.exports = {
  incr_hash,
  read_hash,
  make_hash
};
