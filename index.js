'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisClient = require('redis').createClient();
const hbs = require('express-handlebars');
const encode = require('hashcode').hashCode;

app.set('view engine', 'hbs');

//redisClient.setnx('count', 0);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  var body = ''; 
  req.on('data', function(data) {
  body += data;
  });
  req.on('end', function() {
    var hash = encode().value(body.userURL);
    console.log(body.userURL);
    console.log(hash);
    console.log(encode().value("test"));
  });

  

});



io.on('connection', client => {
  redisClient.get('count', (err, count) => {
    client.emit('new count', count);
  });

  client.on('increment', () => {
    redisClient.incr('count', (err, count) => {
      io.emit('new count', count);
    });
  });

  client.on('decrement', () => {
    redisClient.decr('count', (err, count) => {
      io.emit('new count', count);
    });
  });
});

server.listen(3000);
