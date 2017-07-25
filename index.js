var shortid = require("shortid");
var express = require("express");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var urlShortener = require("./lib/urlshortener");

var app = express();

var port = 4000;
var host = "localhost";

var savedURL = { test: "https://www.google.com/" };

app.listen(port, () => {
  console.log("Serving!" + port);
});

app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get("/", (req, res) => {
  console.log(req.url);
  res.render("index")
});
app.get("/key/:shortUrl", (req, res) => {
  if (savedURL[req.params.shortUrl] != undefined) {
    res.redirect(savedURL[req.params.shortUrl]);
    console.log(savedURL[req.params.shortUrl]);
  } else {
    console.log("not saved");
  }
});

app.post("/", (req, res) => {
	urlShortener.shortenURL(req.body.urlToShorten, (url) => {
		console.log(url);
		res.redirect("/");
	});
});