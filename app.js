const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = redis.createClient();
const { handleUrl } = require("./services/handleUrl.js");
const { makeHash, readHash, incrHash } = require("./services/redis_wrap.js");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", client => {
  console.log("new connection!");

  client.on("newUrl", url => {
    var newUrl = handleUrl(url);
    //add a new hash to the redis database with the name newUrl
    makeHash(newUrl, {
      originalUrl: url,
      newUrl: newUrl,
      clicks: 0
    });
    //read the database , cause why not
    readHash(newUrl).then(data => {
      console.log(data);
    });
  });
});

server.listen(3000);
