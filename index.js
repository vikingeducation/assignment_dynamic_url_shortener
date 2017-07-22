const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const {
  setShortenedLink,
  getURL,
  getAllURLs,
  getAllCounts,
  incrementCount
} = require('./link-shortener');

const app = express();

const hbs = expressHandlebars.create({
  defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

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
  incrementCount(req.params.link);
  getURL(req.params.link).then(url => {
    console.log(url);
    res.redirect(url);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
