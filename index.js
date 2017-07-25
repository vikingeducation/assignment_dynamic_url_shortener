var shortid = require("shortid");
var express = require("express");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var urlShortener = require("./lib/urlshortener");

var app = express();

var server = require("http").createServer(app);
var io = require("socket.io")(server);

var port = 4000;
io.on("connection", () => {
  io.on("newURL", function(url) {
    console.log("am I running");
    urlShortener.shortenURL(url, () => {
      // /res.redirect("/");
    });
  });
});
// var savedURL = { test: "https://www.google.com/" };
// var savedURLArray = ["a", "b"];
server.listen(port, () => {
  console.log("Serving!" + port);
});

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);
app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

io.on("connection", client => {});

app.get("/", (req, res) => {
  //set savedURL as the redis holding key/value
  //reload after post
  urlShortener.retrieveURLs(currentKeys => {
    var urlStuff = Object.keys(currentKeys).map(key => {
      return {
        key: key,
        count: currentKeys[key].count
      };
    });

    console.log(req.hostname);
    res.render("index", { urls: urlStuff });
  });
});

app.get("/key/:shortUrl", (req, res) => {
  urlShortener.GetNewUrl(req.params.shortUrl, url => {
    res.redirect(url);
  });
  //works //res.redirect(urlShortener.GetNewUrl(req.params.shortUrl));
});

//app.post("/", (req, res) => {
// urlShortener.shortenURL(req.body.urlToShorten, () => {
//   res.redirect("/");
// });
//});
