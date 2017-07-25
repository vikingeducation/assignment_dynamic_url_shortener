const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = redis.createClient();
const { handleUrl } = require("./services/handleUrl.js");
const {
  make_hash,
  read_hash,
  incr_hash
} = require("./modules/redis_wrap/redis_wrap.js");

make_hash("awesomeNewUrl", {
  originalUrl: "http://github.com",
  shortUrl: "http://cashcats.biz/",
  clicks: 10
});
read_hash("awesomeNewUrl");
incr_hash("awesomeNewUrl", "clicks", "10");
read_hash("awesomeNewUrl");

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
    redisClient.get(newUrl + " originalUrl visitorCount", (err, urlData) => {
      console.log(urlData);
      io.emit("urlAdded", urlData);
    });
  });
});

server.listen(3000);
