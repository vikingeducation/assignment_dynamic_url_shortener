const lib = require('./lib');
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient();
const hbs = require("express-handlebars");

lib.shortener.linkShortener();

app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));
app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));

app.get('/', (req, res) => {
  io.emit("anEvent");
  res.render("index");
})

// client.on("incr", (count) => {
//
// })

io.on('anEvent', client => {
  console.log("New connection!");

  // client.emit('greeting', (data) => {
  // 	console.log('backend emitted greeting')
  // })
})

io.on('connection', client => {
	client.on('event', (err, data) => {
		console.log('we heard the event')
	})
})

server.listen(3000, () => {
  console.log("I'm listening");
});
