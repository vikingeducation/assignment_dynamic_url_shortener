const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const expressHandlebars = require("express-handlebars");
const linkShortener = require('./lib/link_shortener')
const addShortLink = require('./services/redis/addShortLink')
const getOriginalUrl = require('./services/redis/getOriginalUrl')
redisClient = require("redis").createClient();

///////////////////

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: "main",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.get('/', (req, res) => {

  res.render("index");
});

app.post('/update', (req, res) => {
  let inputURL = req.body.baseURL;
  let urlPair = linkShortener(inputURL);
  addShortLink(urlPair.shortURL, urlPair.inputURL)
  redisClient.hgetall("urlshash", (err, results) => {
    console.log(results)
  });
  res.redirect('/')
});



app.get('/:shortLink', (req, res) => {
  let shortLink = req.params.shortLink;

  console.log(shortLink+" shortLink");

  let origUrl = getOriginalUrl(shortLink);

  origUrl.then(
    function(value) {
      console.log(value + "original URL LINE 48 ");

      // value = "http\://" + value;

      res.redirect(value);
      //res.end(value);
    })
    .catch(function(err) {
      console.error(err);
    });

  res.redirect('/');
});


server.listen(3000);
