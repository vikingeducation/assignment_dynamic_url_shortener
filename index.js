"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient();

//URL shortener
var googleUrl = require("google-url");
googleUrl = new googleUrl();

//Examples
googleUrl.shorten("http://bluerival.com/", function(err, shortUrl) {
  // shortUrl should be http://goo.gl/BzpZ54
});

googleUrl.shorten("http://goo.gl/BzpZ54", function(err, longUrl) {
  // longUrl should be http://bluerival.com/
});

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

redisClient.setnx("count", 0);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  res.redirect("/");
});

io.on("visitor-count", client => {
  redisClient.incr("visitor-count", (err, count) => {
    client.emit("new count", count);
  });
});

server.listen(3000);
