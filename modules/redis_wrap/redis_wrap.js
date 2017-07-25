const redis = require("redis");
const redisClient = redis.createClient();

//set up hash
/*writeRedis(newUrl, url).then(() => {
  return newUrl;
});

function writeRedis(newUrl, url) {
  return new Promise(resolve => {
    console.log(newUrl);
    redisClient.hmset(newUrl, ["originalUrl", url]);
    redisClient.hincrby(newUrl, "visitor-count", 1);
    resolve();
  });
}*/
/* TESTING */
//make a new hash
function make_hash(hash_name, key, field) {
  /*var p = new Promise(resolve => {
    //console.log(newUrl);
    redisClient.hmset(hash_name, [key, field]);
    //redisClient.hincrby(newUrl, "visitor-count", 1);
    resolve();
  });*/

  // client.hmset(hash, key1, val1, ... keyn, valn, [callback])
  redisClient.hmset("new_hash", "dank_meme_count", "1000", (err, data) => {
    //read_hash("new_hash", "dank_meme_count");
    console.log(data);
  });

  //return p;
}
make_hash();
//read a hash
function read_hash(hash_name, key) {
  /*redisClient.get(hash_name + key, (err, data) => {
    console.log(data);
    //io.emit("urlAdded", urlData);
    return data;
  });*/
  //redisClient.hgetall("");
  redisClient.hgetall("test", (err, data) => {
    console.log(data);
  });
}

function test() {
  redisClient.hgetall("test", (err, data) => {
    console.log(data);
  });
  /*
  make_hash("test_hash", "users", "1").then(message => {
    var data = read_hash("test_hash", "users");
    console.log(`Data of test is ${data}`);
  });*/
}
test();
