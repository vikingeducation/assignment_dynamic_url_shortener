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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index');

  let urls = [];

  redisClient.keys('*', (err, results) => {
    urls = results;
    //console.log(results);
  });
  //Get redis keys, pass them through
  //  res.render('castles', { kingdomName, castles });
  res.render('index', { urls });
});

app.get('/:hashcode', (req, res) => {
  let redirectURL = req.params.hashcode;
  redisClient.get(redirectURL, (err, results) => {
    console.log(results);
    res.redirect(`http://www.${results}`);
  });
});

app.post('/', (req, res) => {
  var userURL = req.body.userURL;
  var hashedURL = encode().value(req.body.userURL);

  redisClient.set(userURL, hashedURL);
  redisClient.set(hashedURL, userURL);
  redisClient.get(userURL, (err, results) => {
    console.log(results);
  });
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
