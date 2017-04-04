const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const linkShortener = require('./lib/link_shortener')
const expressHandlebars = require("express-handlebars");
redisClient = require("redis").createClient();

///////////////////

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: "main",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// redisClient.flushall();

//console.log(shortid.generate());

app.get('/', (req, res) => {
    // redisClient.get(urlPair.inputURL, (err, value) => {
    //   console.log(value);
    // })
    res.render("index");
});

app.post('/update', (req, res) => {
  let inputURL = req.body.baseURL;
  let urlPair = linkShortener(inputURL);

  redisClient.setnx(urlPair.inputURL, urlPair.shortURL)
  redisClient.get(urlPair.inputURL, (err, value) => {
    console.log(value);
  })
  res.redirect('/')
})

server.listen(3000);
