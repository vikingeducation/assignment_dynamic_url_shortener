const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { storeUrl, getUrls } = require("./link_shortener");
const {objectToArray} = require("./helpers")



const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  getUrls().then(data => {
    data = objectToArray(data);
    res.render('index', {data});
  });
});

app.post

server.listen(3000);
