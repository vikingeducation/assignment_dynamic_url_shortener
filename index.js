'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisClient = require('redis').createClient();
const expressHandlebars = require('express-handlebars');
const encode = require('hashcode').hashCode;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: 'main'
});

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//redisClient.flushall();

app.get('/', (req, res) => {
  var allKeys = [];

  redisClient.keys('-*', (err, results) => {
    results.forEach(function(key) {
      redisClient.hgetall(key, (err, results) => {
        console.log(results);
        allKeys.push(results);
      });
    });
  });
  res.render('index', { allKeys });
});

app.get('/:hashcode', (req, res) => {
  let redirectURL = req.params.hashcode;

  redisClient.get(redirectURL, (err, results) => {
    console.log(results);
    res.redirect(`http://www.${results}`);
  });
});

//var redObj = {};

app.post('/', (req, res) => {
  //hash: { url: originalURL, count: x };
  //hashID = hash + whatever
  //var userURL = req.body.userURL;
  var hashedURL = encode().value(req.body.userURL);

  redisClient.hmset(
    hashedURL,
    'url',
    req.body.userURL,
    'count',
    0,
    (err, results) => {
      redisClient.hgetall(hashedURL, (err, results) => {
        console.log(results);
      });
    }
  );

  res.redirect('back');
});

// redisClient.hset(
//   hashedURL,
//   'url',
//   req.body.userURL,
//   'count',
//   0,
//   (err, results) => {
//     console.log(err);

// );

//var redObj = { userURL: hashedURL };

// redisClient.set(hashedURL, userURL);
// redisClient.set(userURL, hashedURL);

//redisClient.set(hashedURL, userURL);

//redisClient.set(userURL, redObj);

// redisClient.get(userURL, (err, results) => {
//   console.log(results);
// });
//});

//
// io.on('connection', client => {
//   redisClient.get('count', (err, count) => {
//     client.emit('new count', count);
//   });
//
//   client.on('increment', () => {
//     redisClient.incr('count', (err, count) => {
//       io.emit('new count', count);
//     });
//   });
//
//   client.on('decrement', () => {
//     redisClient.decr('count', (err, count) => {
//       io.emit('new count', count);
//     });
//   });
// });

server.listen(3000);
