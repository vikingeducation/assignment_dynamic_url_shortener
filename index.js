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
  var urls = [];
  var hashes = [];

  redisClient.keys('-*', (err, results) => {
    hashes = results;
    // redisClient.keys('*', (err, results) => {

    hashes.forEach(function(value) {
      redisClient.get(value, (err, results) => {
        urls.push(results);
        console.log(urls);
      });
    });

    res.render('index', { urls, hashes });

    // });

    //console.log(results);
  });
  //Get redis keys, pass them through
  //  res.render('castles', { kingdomName, castles });
});

app.get('/:hashcode', (req, res) => {
  let redirectURL = req.params.hashcode;

  redisClient.get(redirectURL, (err, results) => {
    console.log(results);
    res.redirect(`http://www.${results}`);
  });
});

var redObj = {};

app.post('/', (req, res) => {
  var userURL = req.body.userURL;
  var hashedURL = encode().value(req.body.userURL);

  //var redObj = { userURL: hashedURL };
  redisClient.set(hashedURL, userURL);
  redisClient.set(userURL, hashedURL);
  res.redirect('back');

  //redisClient.set(hashedURL, userURL);

  //redisClient.set(userURL, redObj);

  // redisClient.get(userURL, (err, results) => {
  //   console.log(results);
  // });
});

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
