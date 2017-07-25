const lib = require('./lib');
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient();
const hbs = require("express-handlebars");

app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

lib.shortener.linkShortener();

app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));

app.get('/', (req, res) => {
  io.emit("anEvent");
  res.end("Hello good Sir");
})

// client.on("incr", (count) => {
//
// })



io.on('anEvent', client => {
  console.log("New connection!");
})



server.listen(3000, () => {
  console.log("I'm listening");
});
