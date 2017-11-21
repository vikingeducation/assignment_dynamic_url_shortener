const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("redis");
const redisClient = redis.createClient();

const app = express();

const hbs = expressHandlebars.create({
  defaultLayout: "main"
  // helpers: helpers.registered
});

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  redisClient.incr("visitor-count", (err, count) => {
    res.render("form");
    //
  });
});

app.post("/postinputurl", (req, res) => {
  //res.redirect("back")
  let url, id;
  id = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
  url = req.body.inputurl;
  console.log(url);
  redisClient.set(id, url, (err, response) => {
    if (err) {
      console.log("error");
    } else {
      res.render("form", { res: id });
      console.log(id);
    }
  });
  /*redisClient.incr('visitor-count', (err, count) => {
    res.send(`Visitor Count: ${count}`)
  })*/
});

app.get("/:id", (req, res) => {
  console.log(req.params);
  let id = req.params.id;
  var geturl = new Promise((resolve, reject) => {
    redisClient.get(id, function(err, url) {
      console.log("get: ", url);
      resolve(url);
    });
  });
  geturl.then(url => {
    res.redirect(url);
  });
});

app.listen(3000, () => {
  console.log("server has started");
});
