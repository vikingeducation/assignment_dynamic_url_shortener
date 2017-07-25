const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redis = require("redis");
const redisClient = redis.createClient();
const { handleUrl } = require("./services/handleUrl.js");
const { makeHash, readHash, incrHash } = require("./services/redisWrap.js");

//Eric's ngrok
const host = "http://86cabba8.ngrok.io/t/";
//Ian's ngrok
//const host = "http://107d8cd0.ngrok.io/t/"

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/t/:shortUrl", (req, res) => {
  var url = host + req.params.shortUrl;
  incrHash(url, "clicks", 1).then(() => {
    readHash(url).then(urlData => {
      io.emit("clicks", urlData);
      res.redirect(urlData.originalUrl);
    });
  });
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
      //console.log(`original URL ? ${data}`);
      io.emit("urlAdded", data);
    });
  });
});

server.listen(3000);
