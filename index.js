const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const index = require('./routes/index');

const app = express();
const server = require('http').createServer(app)

const hbs = expressHandlebars.create({
  defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.use('/', index);

app.listen(4600, () => {
  console.log("Check out localhost:4600 for my Dynamic URL Shortener");
});