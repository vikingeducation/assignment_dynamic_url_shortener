const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);
app.use("./public", express.static(__dirname + "public/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", client => {
  console.log("new connection!");

  client.on("newUrl", data => {
    console.log("hi");
  });
});

server.listen(3000);
