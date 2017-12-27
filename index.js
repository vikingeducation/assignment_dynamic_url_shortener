const express = require('express');
const app = express();
// const redis = require('redis');
// const redisClient = redis.createClient();

const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();

redisClient.on('connect', () => {
  console.log('connected to Redis!')
})

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

let urls = {};
let idx = 0;



function makeid() {
  var text = "";
  var allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 15; i++)
    text += allLetters.charAt(Math.floor(Math.random() * allLetters.length));
  return text;
}

app.get('/short/:id', async (req, res)=> {
  var id = req.params.id;
  let direction = await redisClient.hget(id, 'long_url');
  let totalClicks = await redisClient.hget(id, 'clicks');
  totalClicks = parseInt(totalClicks) + 1;
  io.sockets.emit('count', id, totalClicks);
  redisClient.hset(id, "clicks", totalClicks);
  res.redirect(direction);
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

app.get('/', async (req, res, next)=> {
  try {
    const indexes = await redisClient.keys("index:*");
    for( let idx of indexes ) {
      urls[idx] = await redisClient.hgetall(idx);
    }
    console.log( urls)
    res.render('index', { urls } );
  } catch(e) {
    console.log('error');
    next(e);
  };
  urls = {};
});


//
// io.on('connection', client => {
//   console.log("New connection!")
//
//   // redisClient.get('count', (err, count) => {
//   //   client.emit('new count', count);
//   // });
//
//   // client.emit('new count', count);
//
//   // client.on('increment', async () => {
//   //   try {
//   //     await redisClient.incr('count',
//   //     io.emit('new count', count);
//   //   });
//   //   } catch {
//   //
//   //   }
//   // });
//
//   client.on('', async ()=> {
//     io.emit('count', data);
//   })
//
//   // client.on('decrement', () => {
//   //   redisClient.decr('count', (err, count)=> {
//   //     io.emit('new count', count);
//   //   });
//   // });
// });

// app.listen(3000)
server.listen(3000);
