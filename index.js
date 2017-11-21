"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient();
const querystring = require("querystring");

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
  //take URL queries
  let userURL = querystring.parse(req.url);

  res.redirect("/");
});

io.on("connection", client => {
  console.log("hello world");
  client.on("visitor-count", () => {
    console.log("client listener");
    redisClient.incr("visitor-count", (err, count) => {
      io.emit("new count", count);
    });
  });
});

server.listen(3000);

/*
io.on("connection", client => {
  redisClient.get("visitor-count", (err, count) => {
    console.log(count);
    client.emit("new count", count); //server is emitting data back to client via new count event
  });


  });*/

//emit visitor-count from client. Client emits
//Server catches it, emits to client. set up listener on client. Once server updates
//Client catches it. once receive data, update html when appending
