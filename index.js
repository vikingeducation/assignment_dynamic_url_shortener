const express = require('express');
const app = express();
// const redis = require('redis');
// const redisClient = redis.createClient();

const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();

// Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }) );
let linkShortener = require('./models/link_shortener');

// Socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use('/socket.io', express.static(__dirname + 'node_modules/socket.io-client/dist/'));

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));

let idx = 0;
// app.get('/', (req, res) => {
//   redisClient.incr('visitor-count', (err, count) => {
//     res.send(`Visitor Count: ${count}`)
//   })
// });
//
// let shorty = 'http://localhost:3000/short/' + makeid();
// let longy = 'https://i.pinimg.com/736x/32/97/4b/32974b49b7910d6959b79f1bb677dbdd--house-styles-bedroom-decor.jpg';
// redisClient.hset('linkShortener', shorty, longy );

function makeid() {
  var text = "";
  var allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 15; i++)
    text += allLetters.charAt(Math.floor(Math.random() * allLetters.length));
  return text;
}

app.get('/short/:id', (req, res)=> {
  var id = req.params.id;
  let reqLink = 'http://localhost:3000/short/' + id;
  io.emit('new value', value)
  redisClient.hgetall('linkShortener', function(err, object) {
    console.log('object is:  ');
      console.log(object);
      res.redirect(object);
  });
  // redisClient.hget('linkShortener', reqLink, function(err, object) {
  //   console.log('object is:  ');
  //     console.log(object);
  //     res.redirect(object);
  // });
});

app.post('/create', (req, res)=> {
  let longUrl = req.body.longUrl;
  let id = makeid();
  let shortUrl = 'http://localhost:3000/short/' + id;
  let totalClicks = 0;
  idx += 1;
  redisClient.hmset(`index:${idx}`, "short_url", shortUrl, "long_url", longUrl, "clicks", totalClicks);
  res.redirect('back');
});


app.get('/', async (req, res, next) => {
  redisClient.keys('index:*', (err, keys) => {
    keys.forEach( key => {
      redisClient.hgetall(key, (err, url) => {
        
      })
    })
  })
});

// let count = 0;

io.on('connection', client => {
  console.log("Made socket connection!")
  // redisClient.get('linkShortener', (err, object) => {
  //   console.log(object)
  //   client.emit('new linkShortener', object);
  // });
  redisClient.hgetall('linkShortener', (err, object)=> {
    console.log('this is my object');
    console.log(object);
    // redisClient.setnx('myLinks', object );
    client.emit('new linkShortener', object);
  });

  redisClient.incr('increment', (err, value)=> {
    io.emit('new value', value);
  });


  //   redisClient.incr('visitor-count', (err, count) => {
  //     res.send(`Visitor Count: ${count}`)
  //   })
});


// io.on('connection', client => {
//   console.log("New connection!")
//
//   redisClient.get('count', (err, count) => {
//     client.emit('new count', count);
//   });
//
//   // client.emit('new count', count);
//
//   client.on('increment', () => {
//     redisClient.incr('count', (err, count)=> {
//       io.emit('new count', count);
//     });
//   });
//
//   client.on('decrement', () => {
//     redisClient.decr('count', (err, count)=> {
//       io.emit('new count', count);
//     });
//   });
// });

// app.listen(3000)
server.listen(3000);
