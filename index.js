const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("redis");
const redisClient = redis.createClient();

const app = express();

//for websocket via socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server);

let visited = [];
let links = [];
let counts = [];
let shortenedlinks = [];
let newwebcount = false;
const hbs = expressHandlebars.create({defaultLayout: "main"});

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

let visitorcount;

app.get("/", (req, res) => {
  redisClient.incr("visitor-count", (err, count) => {
    visitorcount = count;
  });

  redisClient.KEYS("*", (err, keys) => {
    for (var i = 0; i < keys.length; i++) {
      let shortenedlink = `http://localhost:3000/${keys[i]}`;
      shortenedlinks.push(shortenedlink);
      redisClient.hgetall(keys[i], (err, url) => {
        if (url) {
          links.push(url["link"]);
          counts.push(url["count"]);
        }
      });
    }
  });

  res.render("form", {
    links: links,
    counts: counts,
    shortenedlinks: shortenedlinks.slice(0, shortenedlinks.length - 1)
  });

  //this is to refresh the arrays so that they aren't doubled on page refresh
  links = [];
  counts = [];
  shortenedlinks = [];
});

app.post("/postinputurl", (req, res) => {
  let url, id;
  id = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

  url = req.body.inputurl;
  let count = 0;
  redisClient.HMSET(
    id,
    {
      link: url,
      count: "0"
    },
    (err, response) => {
      if (err) {
        console.log("error");
      } else {
        res.render("form", {res: id});
      }
    }
  );
});

app.get("/:id", (req, res) => {
  newwebcount = true;

  let id = req.params.id;

  redisClient.hgetall(id, function(err, url) {
    if (url["link"].slice("")[0] === "h") {
      io.emit("newwebcount", "nice");
      newwebcount = false;
      let num = Number(url["count"]) + 1;
      redisClient.HMSET(
        id,
        {
          link: url["link"],
          count: num
        },
        (err, response) => {}
      );
      res.redirect(url["link"]);
    } else {
      res.redirect("/");
    }
  });
});

io.on("connection", client => {
  console.log("New connection!");

  client.emit("visitorcount", visitorcount);

  io.emit("visitorcount", visitorcount);
});

server.listen(3000);
