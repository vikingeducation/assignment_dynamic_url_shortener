var shortid = require("shortid");
var express = require("express");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var urlShortener = require("./lib/urlshortener");

var app = express();

var port = 4000;
var host = "localhost";

var savedURL = { test: "https://www.google.com/" };
var savedURLArray = ["a", "b"];
app.listen(port, () => {
  console.log("Serving!" + port);
});

app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  //set savedURL as the redis holding key/value
  //reload after post
  urlShortener.retrieveURLs(currentKeys => {
    res.render("index", { urls: Object.keys(currentKeys) });
  });
});

app.get("/key/:shortUrl", (req, res) => {
  console.log(urlShortener.GetNewUrl(req.params.shortUrl));
  //works //res.redirect(urlShortener.GetNewUrl(req.params.shortUrl));
});

app.post("/", (req, res) => {
  urlShortener.shortenURL(req.body.urlToShorten, url => {
    console.log(url);
    res.redirect("/");
  });
});
