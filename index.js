const express = require('express');
const app = express();

const redis = require('redis');
const redisClient = redis.createClient();

app.get('/', (req, res) => {
  redisClient.incr('visitor-count', (err, count) => {
     res.send(`Visitor Count: ${count}`)
   });
});

app.listen(4500, () => {
  console.log("Check out localhost:4500 for my Dynamic URL Shortener!!");
});