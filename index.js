"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient();

//URL shortener
var GoogleUrl = require("google-url");
googleUrl = new GoogleURL();

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

server.listen(3000);
