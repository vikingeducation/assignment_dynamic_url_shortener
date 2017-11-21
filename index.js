const express = require("express");
const app = express();
// express
const server = require("http").createServer(app);
// socket server?
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const redisClient = require("redis").createClient();
var TinyURL = require("tinyurl");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.get("/", (req, res) => {
  res.render("main");
});

app.listen(3000, "localhost", () => {});

app.post("/", (req, res) => {
  let longUrl = req.body["url-input"];

  TinyURL.shorten(longUrl, function(shortUrl) {
    redisClient.hmset(
      longUrl, {
        longUrl: longUrl,
        shortUrl: shortUrl,
        clicks: 0
      },
      (err, data) => {

        let keyArray = [];
        redisClient.keys('*', (err, keys) => {
          keys.forEach(longUrl => {
            keyArray.push(longUrl);

          });
          console.log("keyArray is " + keyArray);
          var params = [];
          keyArray.forEach(longUrl => {
            console.log("longUrl is " + longUrl);
            redisClient.hgetall(longUrl, (err, obj) => {
              console.log("err " + err);
              console.log(obj);
              console.log(typeof obj);
              console.log(typeof params);
              console.log(Array.isArray(params));
              params.push(obj);
            });
          });


          params = {
            params: params
          };
          res.render("main", params);
        });
      });
  });
});