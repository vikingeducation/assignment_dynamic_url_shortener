const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const { getUrl, setUrl, getAllUrls } = require('./models/urlHandlers');

const host = 'localhost';
const port = 3000;

const app = express();

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  partialsDir: 'views/',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  getAllUrls((allUrlPairs) => {
    res.render('index', { allUrlPairs });
  });
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
