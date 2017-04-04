const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
redisClient = require("redis").createClient();



///////////////////

// redisClient.flushall();

//console.log(shortid.generate());

app.get('/', (req, res) => {
  redisClient.get("count", (err, value) => {
    console.log(value);
    res.sendFile(__dirname + "/index.html");
  })
});

app.post('/update', (req, res) => {
  console.log(req.body)
  res.redirect('/')
})

server.listen(3000);
