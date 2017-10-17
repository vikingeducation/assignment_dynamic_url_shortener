const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const urlShortener = require('./modules/urlShortener.js');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const hbs = expressHandlebars.create({defaultLayout: 'main'});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  let urls = [];
  urlShortener.getAllURLs().then(data => {
    data.forEach(shortURL => urls.push(urlShortener.getLongURL(shortURL)));
    Promise.all(urls).then(array => res.render('index', {server: 'http://localhost:4600', urls: array}));
  });
});

app.post('/', function(req, res) {
  urlShortener.shortenURL(req.body.longURL);
  res.redirect('back');
});

app.get('/:shortURL', function(req, res){
  const shortURL = req.params.shortURL;
  console.log(shortURL);
  urlShortener.incrementCount(shortURL);
  urlShortener.getLongURL(shortURL).then(function(obj){
    console.log(obj);
    io.emit("updateCount", obj);
    res.redirect(obj.longURL);
  });
});

server.listen(4600, () => {
  console.log("Check out localhost:4600 for my Dynamic URL Shortener");
});
