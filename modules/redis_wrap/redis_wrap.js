const redis = require("redis");
const redisClient = redis.createClient();

/* TESTING */
//make a new hash
function make_hash_key_value(hash_name, key, field) {
  /*var p = new Promise(resolve => {
    //console.log(newUrl);
    redisClient.hmset(hash_name, [key, field]);
    //redisClient.hincrby(newUrl, "visitor-count", 1);
    resolve();
  });*/

  // client.hmset(hash, key1, val1, ... keyn, valn, [callback])
  redisClient.hmset(
    "new_hash",
    "dank_meme_count",
    "1000",
    "other",
    "things",
    (err, data) => {
      //read_hash("new_hash", "dank_meme_count");
      console.log(data);
    }
  );

  //return p;
}
//make a new hash
//client.hmset(hash, obj[, callback]) other signature
function make_hash(hash_name, obj) {
  /*var p = new Promise(resolve => {
    //console.log(newUrl);
    redisClient.hmset(hash_name, [key, field]);
    //redisClient.hincrby(newUrl, "visitor-count", 1);
    resolve();
  });*/

  //client.hmset(hash, obj[, callback]) other signature
  // client.hmset(hash, key1, val1, ... keyn, valn, [callback])
  redisClient.hmset(hash_name, obj, (err, data) => {
    //read_hash("new_hash", "dank_meme_count");
    console.log(data);
  });

  //return p;
}

//read an entire  hash
function read_hash(hash_name) {
  /*redisClient.get(hash_name + key, (err, data) => {
    console.log(data);
    //io.emit("urlAdded", urlData);
    return data;
  });*/
  //redisClient.hgetall("");
  redisClient.hgetall(hash_name, (err, data) => {
    console.log(data);
  });
}
function incr_hash(hash_name, key, amount) {
  redisClient.hincrby(hash_name, key, amount, (err, data) => {
    console.log(`increment data ${data}`);
  });
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
