var shortid = require("shortid");
var express = require("express");
var app = express();
//var urlShortner = require("./lib/urlshortener");

var port = 4000;
var host = "localhost";

var savedURL = { test: "https://www.google.com/" };

app.listen(port, () => {
  console.log("Serving!" + port);
});

app.get("/", (req, res) => {
  console.log(req.url);
});
app.get("/key/:shortUrl", (req, res) => {
  //console.log(req);
  if (savedURL[req.params.shortUrl] != undefined) {
    res.redirect(savedURL[req.params.shortUrl]);
    console.log(savedURL[req.params.shortUrl]);
  } else {
    console.log("not saved");
  }
});
//app.post(, (req, res) => {}););
