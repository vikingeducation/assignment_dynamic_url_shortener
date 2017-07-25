const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = redis.createClient();
const { handleUrl } = require("./services/handleUrl.js");

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
    handleUrl(url).then(resolve => {
      redisClient.hgetall(resolve, (err, urlData) => {
        io.emit("urlAdded", urlData);
      });
    });
  });
});

server.listen(3000);
