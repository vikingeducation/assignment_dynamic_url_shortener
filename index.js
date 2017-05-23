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
  let p = getAllLinks()

  p.then((links) => {
    res.render('index', {
      links
    })
  })
})

app.post('/update', (req, res) => {
  let originalURL = req.body.originalURL

  // returns promise
  let p = saveLink(originalURL)

  // When we do websockets counts, we set a second promise, then resolve with Promise.all
  p.then((data) => {
    res.redirect('back')
  })
})

app.get('/r/:hash', (req, res) => {
  let hash = req.params.hash
  
  let p = getLink(hash)

  p.then((link) => {
    res.redirect(link)
  })
})

server.listen(port, () => {
    console.log(`Currently listening on Port ${ port }`)
})
