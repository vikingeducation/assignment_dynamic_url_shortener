const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const {
  getUrlObject,
  setUrlObject,
  getAllUrlObjects,
  incrementClicks,
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
  getUrlObject(path).then((urlObject) => {
    io.emit('new count', urlObject);
    res.redirect(urlObject.long);
  });
});

app.post('/', (req, res) => {
  const { originalUrl } = req.body;
  const shortPath = setUrlObject(originalUrl);
  let urlObject = {};
  const p = new Promise((resolve) => {
    getUrlObject(shortPath).then((data) => {
      urlObject = data;
      resolve(urlObject);
    });
  });
  p.then(() => {
    io.emit('new urlObject', urlObject);
    res.redirect('/');
  });
});

server.listen(port, () => {
  console.log(`Listening at ${host}:${port}`);
});
