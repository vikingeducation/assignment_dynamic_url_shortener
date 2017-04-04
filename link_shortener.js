const redisClient = require("redis").createClient();
const sh = require("shorthash");

var test = sh.unique("www.google.com");
console.log(test);
