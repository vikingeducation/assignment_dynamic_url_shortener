"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient(process.env.REDIS_URL);
const querystring = require("querystring");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");

const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//URL shortener
let googleUrl = require("google-url");
googleUrl = new googleUrl({ key: "AIzaSyDJGdPIZSgoDjYijfRFRY6OvXmqjnxUVlY" });

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

redisClient.setnx("count", 0);

app.get("/", (req, res) => {
  res.render("index");
});

let tableArr = [];

app.post("/", (req, res) => {
  let shortenUrl = "test";
  let short = url => {
    return new Promise((resolve, reject) => {
      googleUrl.shorten(req.body.userURL, (err, shortUrl) => {
        if (err) {
          reject(err);
        } else {
          resolve((shortenUrl = shortUrl));
        }
      });
    });
  };
  short(req.body.userURL)
    .then(function(result) {
      redisClient.hmset(
        "table",
        "shortUrl",
        shortenUrl,
        "longUrl",
        req.body.userURL,
        (error, result) => {
          if (error) res.send("Error: " + error);
          redisClient.hgetall("table", function(err, object) {
            console.log(object);
            tableArr.push(object);
            console.log(tableArr);
            res.render("index", {
              urlObject: tableArr,
              objLength: tableArr.length
            });
          });
        }
      );
    })
    .catch(function(err) {
      console.error(err);
    });
});

//Total count
io.on("connection", client => {
  client.on("visitor-count", () => {
    redisClient.incr("visitor-count", (err, count) => {
      io.emit("new count", count);
    });
  });

  client.on("click", data => {
    redisClient.incr("click", (err, count) => {
      io.emit("new click", count, data);
    });
  });

  // for (let i = 1; i < tableArr.length; i++) {
  //   client.on("website-count" + i, () => {
  //     console.log("website-count" + i);
  //     redisClient.incr("website-count" + i, (err, count) => {
  //       io.emit("new website-count" + i, count);
  //     });
  //   });
  // }
});

const PORT = process.env.PORT || 3000;
if (process.env.REDIS_URL) {
  app.locals.REDIS_URL = process.env.REDIS_URL;
}

server.listen(PORT);
