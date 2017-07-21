const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const {
  setShortenedLink,
  getShortenedLink,
  getAllURLs
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
  // let urls = getAllURLs();
  // console.log(urls);
  // res.render('index', { urls });
  getAllURLs().then(urls => {
    console.log(urls);
    res.render('index', { urls: urls });
  });
});

app.post('/', (req, res) => {
  let url = req.body.link;
  setShortenedLink(url);
  res.redirect('back');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
