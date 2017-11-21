const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");
const TinyURL = require("tinyurl");
const bodyParser = require("body-parser");
const redisClient = require("redis").createClient();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.get("/", (req, res) => {
  let keyArray = [];
  redisClient.keys("*", (err, keys) => {
    keys.forEach(longUrl => {
      keyArray.push(longUrl);
    });
    var params = [];
    keyArray.forEach(longUrl => {
      redisClient.hgetall(longUrl, (err, obj) => {
        params.push(obj);
      });
    });

    let paramsObj = {
      params: params
    };
    res.render("main", paramsObj);
  });
});

app.post("/", (req, res) => {
  // adds http:// if not already there
  let longUrl = req.body["url-input"];
  let httpCheck = longUrl.slice(0, 7);
  if (httpCheck != "http://") {
    longUrl = "http://" + longUrl;
  }

  // npm package that shortens the URL
  TinyURL.shorten(longUrl, function(shortUrl) {
    // hmset that takes creates an object with original, short urls
    redisClient.hmset(
      longUrl,
      {
        longUrl: longUrl,
        shortUrl: shortUrl,
        clicks: 0
      },
      (err, data) => {
        // getting keys from ALL redis objects
        let keyArray = [];
        redisClient.keys("*", (err, keys) => {
          keys.forEach(longUrl => {
            keyArray.push(longUrl);
          });
          // retrieves all objects using keys, and pushes into
          // params
          var params = [];
          keyArray.forEach(longUrl => {
            redisClient.hgetall(longUrl, (err, obj) => {
              params.push(obj);
            });
          });

          let paramsObj = {
            params: params
          };
          res.render("main", paramsObj);
        });
      }
    );
  });
});

io.on("connection", client => {
  client.on("linkClicked", longUrl => {
    redisClient.hmget(longUrl, "clicks", (err, array) => {
      let clicks = Number(array[0]);
      clicks++;
      redisClient.hmset(longUrl, "clicks", clicks, (err, data) => {
        let clickInfo = {
          clicks: clicks,
          id: longUrl
        };
        io.emit("newCount", clickInfo);
      });
    });
  });
});

server.listen(3000);
