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
      longUrl,
      {
        longUrl: longUrl,
        shortUrl: shortUrl,
        clicks: 0
      },
      (err, data) => {
        console.log(data);
        console.log(err);
        let params = [];
        let keyArray = [];
        redisClient.keys(keys => {
          keys.forEach(longUrl => {
            keyArray.push(longUrl);

          });
          keyArray.forEach(longUrl => {
            redisClient.hgetall(longUrl, (err, obj) => {
              params.push(obj);
            });
          });
          params = {
            params: params
          };
          res.redirect("back", params);
        }
        });
    );
  });
});
