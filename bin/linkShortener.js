const redisClient = require("redis").createClient();
const sh = require("shorthash");


let url = 'http://www.google.com/fasfd/fsdaf/ffd/f/23wresg/search/test124';


function shortenURL(url) {
  let shortURL = sh.unique(url);
  redisClient.hmset(shortURL, {"shortURL": shortURL, "longURL": url, "count": "0"});
  return shortURL;
}

function lengthenURL(url, callback) {
  redisClient.hgetall(url, callback);
}

function addClick(url) {
  redisClient.hincrby(url, "count", 1);
}

module.exports = {
  shortenURL,
  lengthenURL,
  addClick
};

/*
let test = shortenURL(url, redisClient.print);
console.log(test);
lengthenURL(test, function(err, obj) {
  console.log(obj);
});
addClick(test);
lengthenURL(test, function(err, obj) {
  console.log(obj);
});
*/
