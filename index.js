const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const {
  getUrl, setUrl, getAllUrlObjects, incrementClicks,
} = require('./models/urlHandlers');

const host = 'localhost';
const port = 3000;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/socket.io', express.static(`${__dirname}node_modules/socket.io-client/dist/`));

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  partialsDir: 'views/',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  getAllUrlObjects((urlObjects) => {
    res.render('index', { urlObjects });
  });
});

app.get('/:path', (req, res) => {
  const { path } = req.params;
  incrementClicks(path);
  getUrl(path, (originalUrl) => {
    res.redirect(originalUrl);
  });
});

app.post('/', (req, res) => {
  const { originalUrl } = req.body;
  setUrl(originalUrl);
  res.redirect('/');
});

// io.on('connection', (client) => {
//   client.emit('new count', count);
// });

server.listen(port, () => {
  console.log(`Listening at ${host}:${port}`);
});
