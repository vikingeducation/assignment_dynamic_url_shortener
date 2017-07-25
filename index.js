const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const {
  setShortenedLink,
  getURL,
  getAllURLs,
  getAllCounts,
  incrementCount
} = require('./link-shortener');

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  '/socket.io',
  express.static(__dirname + '/node_modules/socket.io-client/dist/')
);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', client => {
  console.log('new connection');
});

app.get('/', (req, res) => {
  getAllURLs().then(urls => {
    getAllCounts().then(counts => {
      res.render('index', { urls: urls, counts: counts });
    });
  });
});

app.post('/', (req, res) => {
  let url = req.body.link;
  setShortenedLink(url);

  res.redirect('back');
});

app.get('/:link', (req, res) => {
  incrementCount(req.params.link).then(newCount => {
    console.log(newCount);
    getURL(req.params.link).then(url => {
      console.log(url);
      io.emit('increment count', req.params.link, newCount);
      res.redirect(url);
    });
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
