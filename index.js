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
  getAllLinks,
  incrementClickCount,
  saveClickCounts,
  getAllClickCounts
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
  let p1 = saveLink(originalURL)
  let p2 = saveClickCounts(originalURL)
  let p3 = getAllLinks()
  let p4 = getAllClickCounts()

  Promise.all([p1, p2, p3, p4]).then(values => { 
    let links = values[2]
    let counts = values[3]
    io.sockets.emit('new link', links, counts)
    res.redirect('back')
  });
})

app.get('/r/:hash', (req, res) => {
  let hash = req.params.hash
  
  let p = getLink(hash)

  p.then((link) => {
    res.redirect(link)
  })
})

io.on('connection', client => {
  let p1 = getAllLinks()
  let p2 = getAllClickCounts()
  
  Promise.all([p1, p2]).then(values => {
    let links = values[0]
    let counts = values[1]
    client.emit('new link', links, counts)
  })

  client.on('click', event => {
    incrementClickCount(event)
      .then(count=> {
        let p1 = getAllLinks()
        let p2 = getAllClickCounts()
        
        Promise.all([p1, p2]).then(values => {
          let links = values[0]
          let counts = values[1]
          io.emit('new link', links, counts)
        })
      })
  })
})

server.listen(port, () => {
    console.log(`Currently listening on Port ${ port }`)
})
