const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const linkShortener = require('./lib/link_shortener')
redisClient = require("redis").createClient();



///////////////////

app.use(bodyParser.urlencoded({ extended: true }));

// redisClient.flushall();

//console.log(shortid.generate());

app.get('/', (req, res) => {
    redisClient.get(urlPair.inputURL, (err, value) => {
      console.log(value);
    })
    res.sendFile(__dirname + "/index.html");
});

app.post('/update', (req, res) => {
  let inputURL = req.body.baseURL;
  let urlPair = linkShortener(inputURL);

  redisClient.setnx(urlPair.inputURL, urlPair.shortURL)

  res.redirect('/')
})

server.listen(3000);
