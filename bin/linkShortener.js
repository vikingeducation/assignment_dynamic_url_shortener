const redisClient = require("redis").createClient();
const sh = require("shorthash");
const debug = require('debug')('linkShorterner');

redisClient.del("URLList");

function shortenURL(url) {
  let shortURL = sh.unique(url);
  redisClient.hmset(shortURL, {
    "shortURL": shortURL,
    "longURL": url,
    "count": "0"
  });
  redisClient.rpush("URLList", shortURL);
  debug(`shortened URL ${url} to ${shortURL}`);
  return shortURL;
}

function getURLs() {
  return new Promise(function(resolve, reject) {
    redisClient.lrange("URLList", 0, -1, function(err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });

}

function lengthenURL(url) {
  return new Promise(function(resolve, reject) {
      redisClient.hgetall(url, function (err, obj) {
        if (err) reject(err);
        resolve(obj);
      });
    })
  };


function addClick(url) {
  redisClient.hincrby(url, "count", 1);
}

module.exports = {
  shortenURL,
  lengthenURL,
  getURLs,
  addClick
};


let url = 'http://www.google.com/';

let test = shortenURL(url);
