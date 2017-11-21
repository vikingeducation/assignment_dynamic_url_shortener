const express = require('express')
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require('redis');
const redisClient = redis.createClient();


const app = express()

const hbs = expressHandlebars.create({
  defaultLayout: "main"
  // helpers: helpers.registered
});

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set("view engine", "handlebars");

//app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  redisClient.incr('visitor-count', (err, count) => {
    res.render("form")
    //
  })
});

app.post('/postinputurl', (req, res) => {
  //res.redirect("back")
  redisClient.incr('visitor-count', (err, count) => {
    res.send(`Visitor Count: ${count}`)
  })
});

app.listen(3000, () => {
  console.log('server has started');
});
