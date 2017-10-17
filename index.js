const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const {
  shortenURL,
  getAllURLs,
  getLongURL,
  incrementCount
} = require('./modules/urlShortener.js');

const hbs = expressHandlebars.create({defaultLayout: 'main'});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  let urls = [];
  getAllURLs().then(data => {
    data.forEach(shortURL => urls.push(getLongURL(shortURL)));
    Promise.all(urls).then(array => 
      res.render('index', {server: 'http://localhost:4600', urls: array})
    );
  });
});

app.post('/', function(req, res) {
  shortenURL(req.body.longURL);
  res.redirect('back');
});

app.get('/:shortURL', function(req, res){
  const shortURL = req.params.shortURL;
  incrementCount(shortURL);
  getLongURL(shortURL).then(data => {
    io.emit("updateCount", data);
    res.redirect(data.longURL);
  });
});

server.listen(4600, () => {
  console.log("Check out localhost:4600 for my Dynamic URL Shortener");
});
