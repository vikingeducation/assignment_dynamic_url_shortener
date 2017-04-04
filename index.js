'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisClient = require('redis').createClient();
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const encode = require('hashcode').hashCode;
const shortid = require('shortid');

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

  redisClient.keys('*', (err, results) => {
    results.forEach(function(key) {
      redisClient.hgetall(key, (err, results) => {
        console.log(results);
        allKeys.push(results);
      });
    });
  });
  res.render('index', { allKeys });
});

app.get('/:uniqueID', (req, res) => {
  let hashedURL = req.params.uniqueID;

  redisClient.hget(hashedURL, 'count', (err, results) => {
    redisClient.hincrby(hashedURL, 'count', 1, () => {
      //emit the fact that incrementing has happened
      //io.emit (messagename, updatedCount)
      redisClient.hget(hashedURL, 'url', (err, results) => {
        console.log(results);
        res.redirect(`http://www.${results}`);
      });
    });
  });
});

app.post('/', (req, res) => {
  var uniqueID = shortid.generate(req.body.userURL);
  var d = new Date();
  var creationTime = d.toString();

  redisClient.hmset(
    uniqueID,
    'uniqueID',
    uniqueID,
    'creationTime',
    creationTime,
    'url',
    req.body.userURL,
    'count',
    0,
    (err, results) => {
      redisClient.hgetall(uniqueID, (err, results) => {
        console.log(results);
      });
    }
  );

  res.redirect('back');
});

io.on('connection', client => {
  redisClient.get('count', (err, count) => {
    client.emit('new count', count);
  });

  client.on('increment', uniqueID => {
    redisClient.hincrby(uniqueID, 'count', 1, () => {
      console.log('incremented ' + uniqueID);
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
