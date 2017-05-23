const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')

const io = require('socket.io')(server)

const handlebars = require('express-handlebars')
const port = 3030

const { 
  saveLink,
  getLink,
  getAllLinks
} = require('./services/redis-store')

app.use(bodyParser.urlencoded({ extended: false }))

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/update', (req, res) => {
  let originalURL = req.body.originalURL

  // returns promise
  let p = saveLink(originalURL)

  // When we do websockets counts, we set a second promise, then resolve with Promise.all
  p.then((data) => {

    let p2 = getAllLinks()
    p2.then(links => {
      io.sockets.emit('new link', links)
      res.redirect('back')
    })
  })
})

app.get('/r/:hash', (req, res) => {
  let hash = req.params.hash
  
  let p = getLink(hash)

  p.then((link) => {
    res.redirect(link)
  })
})

io.on('connection', client => {
  let p = getAllLinks()
  p.then(links => {
    client.emit('new link', links)
  })
})

server.listen(port, () => {
    console.log(`Currently listening on Port ${ port }`)
})

// Now what's next?
// io.on connection, getAllLinks.then(link => client.emit("new link", links));
//  on update
// io.sockets.emit('new link', 3)
// io.emit("new link")
// then in our html:
// we need to build table dynamically with jQuery. UGH but ok
/* from index.js:
io.on("connection", client => {
  redisClient.get("count", (err, count) => {
    client.emit("new count", count);
  });

  client.on("increment", () => {
    redisClient.incr("count", (err, count) => {
      io.emit("new count", count);
    });
  });

  client.on("decrement", () => {
    redisClient.decr("count", (err, count) => {
      io.emit("new count", count);
    });
  });
});
*/

/* from index.html
var socket = io.connect('http://localhost:3002')

socket.on('new count', function(count) {
  $("#count").html(count)
})

$("#increment").click(function() {
  socket.emit('increment')
})

$("#decrement").click(function() {
  socket.emit('decrement')
})
*/