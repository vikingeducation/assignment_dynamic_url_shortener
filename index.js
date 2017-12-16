const express = require('express');
const app = express();
const redis = require('redis');
const redisClient = redis.createClient();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }) );
let linkShortener = require('./models/link_shortener');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use('/socket.io', express.static(__dirname + 'node_modules/socket.io-client/dist/'));

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(express.static(`${__dirname}/public`));

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
  redisClient.hget('linkShortener', reqLink, function(err, object) {
    console.log('object is:  ');
      console.log(object);
      res.redirect(object);
  });
});

app.post('/create', (req, res)=> {
  let longUrl = req.body.longUrl;
  let shortUrl = 'http://localhost:3000/short/' + makeid();
  redisClient.hset('linkShortener', shortUrl, longUrl );
  res.redirect('back');
});

app.get('/', (req, res)=> {
  redisClient.hgetall('linkShortener', function(err, object) {
    console.log('this is my object');
    console.log(object);
    // redisClient.setnx('myLinks', object );
    res.render('index', { object } );
  });
});

// let count = 0;

io.on('connection', client => {
  console.log("Web Sockets!")
  redisClient.get('linkShortener', (err, object) => {
    console.log(object)
    client.emit('new linkShortener', object);
  });

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
