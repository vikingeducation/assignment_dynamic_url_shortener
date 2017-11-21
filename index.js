const express = require("express");
const app = express();
// express
const server = require("http").createServer(app);
// socket server?
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
const redisClient = redis.createClient();



app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.get("/", (req, res) => {
  res.render('main');
})

app.listen(3000, 'localhost', () => {

})

app.post('/', (req, res) => {
  let url = req.body["url-input"];
  console.log(req.body['url-input']);
  res.redirect('back');
})