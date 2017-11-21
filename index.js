const express = require("express");
const app = express();
// express
const server = require("http").createServer(app);
// socket server?
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const redisClient = require("redis").createClient();
const url = require("short-url");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.get("/", (req, res) => {
  res.render("main");
});

app.listen(3000, "localhost", () => {});

app.post("/", (req, res) => {
  let long_url = req.body["url-input"];

  url.shorten("www.google.com", function(err, short_url) {
    // redisClient.setnx(long_url, short_url);
    // redisClient.get(long_url, (err, short) => {
    console.log(short_url);

    // });
    res.redirect("/");
  });
});
