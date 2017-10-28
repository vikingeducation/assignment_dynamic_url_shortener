const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const { getUrl, setUrl, getAllUrls } = require('./models/urlHandlers');

const host = 'localhost';
const port = 3000;

const app = express();

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  partialsDir: 'views/',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  getAllUrls((urlPairs) => {
    res.render('index', { urlPairs });
  });
});

app.get('/:path', (req, res) => {
  const { path } = req.params;
  getUrl(path, (originalUrl) => {
    res.redirect(originalUrl);
  });
});

app.post('/', (req, res) => {
  const { originalUrl } = req.body;
  setUrl(originalUrl);
  res.redirect('/');
});

// app.get('/', (req, res) => {
//   const url = '99tch';
//   getUrl(url, (value) => {
//     console.log(value);
//     res.send(value);
//   });
// });

// app.get('/', (req, res) => {
//   const url = 'looooooooooongUrl';
//   setUrl(url, (value) => {
//     console.log(value);
//     res.send(value);
//   });
// });

// const shortUrl = `${host}:${port}/${shortPath}`;

app.listen(port, () => {
  console.log(`Listening at ${host}:${port}`);
});
