// Three main paths
// '/' where it just shows stuff
// queries redis database for all registered urls
// what redis data structure to use? probably hashh
// displays them
// '/create' which registers a new url with redis
// '/r/:hash:' which accesses redis hash to find url, then redirects user to this url

// then websockets does the querying in '/'
// add websockets count separate from other things?
// 
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const handlebars = require('express-handlebars')
const io = require('socket.io')(server)
const redisClient = require('redis').createClient()
const port = 3030

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('index')
})

server.listen(port, () => {
    console.log(`Currently listening on Port ${ port }`)
})
