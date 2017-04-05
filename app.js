const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const {
  storeUrl,
  getUrls,
  getUrl,
  updateCounter,
  getCounterAndStamp
} = require("./link_shortener");
const { objectToArray } = require("./helpers");

// Set up handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  getUrls().then(urls => {
    objectToArray(urls, data => {
      res.render("index", { data });
    });
  });
});

app.get("/:hash", (req, res) => {
  let hash = req.params.hash;
  getUrl(hash).then(data => {
    res.redirect(`http://${data}`);
  });
});

app.post("/add", (req, res) => {
  let url = req.body.url;
  storeUrl(url, (url) => {
    res.redirect("/");
  });
});

io.on("connection", client => {

  client.on("increment", hashName => {
    updateCounter(hashName, number => {
      io.emit("new count", { hashName, number });
    });
  });

	client.on('form submit', newUrl =>{
    var url = newUrl;
    storeUrl(url, (shortUrl) => {
      getCounterAndStamp(shortUrl, (counterData, timeData) => {
        io.emit("new url", {url, shortUrl, counterData, timeData});
      })
    }); 
	});
});

server.listen(3000);
