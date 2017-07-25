const lib = require('./lib');
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");


app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));
app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render("index");
})

// app.post("/", (req, res) => {
//   let url = req.body.url;
//   let id = lib.shortener.linkShortener();
//   redisClient.set(id, url, () => {
//     console.log("This is working!");
//     res.render("index", { id, url});
//   })
// })

// client.on("incr", (count) => {
//
// })


io.on('connection', client => {
	client.on('event', (err, data) => {
		console.log('we heard the event')
	})

  client.on("url", (url) => {
    let { name } = url;
    let id = lib.shortener.linkShortener();

    if (validUrl.isUri(name)) {
      name = JSON.stringify(name)
      console.log("url is valid")
      lib.redisTools.storeData(id, name);

      lib.redisTools.getData(id);
    } else {
      console.error("error")
    }
  })
})

server.listen(3000, () => {
  console.log("I'm listening");
});
