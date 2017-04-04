const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { storeUrl, getUrls } = require("./link_shortener");

//function takes url
//hashes url
//stores hash as key and url as value in redis
//link_shortener will store and retieve
//
// getUrls().then(data => {
//   console.log(data);
// });

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  getUrls().then(data => {
    console.log(data);
  });
  res.sendFile(__dirname + "/index.html");
});
server.listen(3002);
