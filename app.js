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
read_hash("awesomeNewUrl").then(data => {
  console.log(data);
});

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
    make_hash(newUrl, {
      originalUrl: url,
      newUrl: newUrl,
      clicks: 0
    });
    //read the database , cause why not
    read_hash(newUrl).then(data => {
      console.log(data);
    });
  });
});

server.listen(3000);
