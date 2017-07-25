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
let baseUrl = process.env.BASE_URL || "http://localhost:3000";

io.on('connection', client => {
	client.on('event', (err, data) => {
		console.log('we heard the event')
	})

  client.on("url", (url) => {

    let id = lib.shortener.linkShortener();
    let { name } = url;
    let objStorage = [
      id,
      name,
      `${baseUrl}/${id}`,
      0
    ]

    if (validUrl.isUri(name)) {
      lib.redisTools.storeData(objStorage)
        .then(data => {
          // console.log(data, 'what do we get in index.js')
          console.log('--------------------------------------------------')
          lib.redisTools.getData(id)
            .then(result => {
              console.log('result????????')
              console.log(result);
            })
        })


      



    } else {
      console.error("error")
    }
  })
})

server.listen(3000, () => {
  console.log("I'm listening");
});
