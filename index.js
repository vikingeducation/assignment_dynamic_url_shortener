const express = require('express')
const app = express()
const server = require('http').createServer(app)
const handlebars = require('express-handlebars')
const io = require('socket.io')(server)
const bodyParser = require('body-parser');

const {
  getLink,
  getAllLinks,
  saveLink,
  increment,
  getCounts
} = require('./services/saveandgetlinks');

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"))
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', client => {
  console.log('new connection');
});

app.get('/', (req, res) => {

  getAllLinks().then(urls => {
    getCounts().then(counts =>{
      console.log(urls);
      console.log(counts);
      res.render('index', { urls, counts});
    })
  });
})

app.post('/update', (req, res) => {
  console.log(req.body.url)
  let url = req.body.url;
  let shortlink = saveLink(url);
  console.log("shortlink", shortlink)
  io.emit('addnewlink', url, shortlink)
  res.redirect('back');
});


app.get('/r/:id', function(req, res) {
  let redirect = req.params.id;
  console.log("req.params.id", redirect)
  increment(redirect).then(count => {
    console.log("count", count);
    getLink(redirect).then(url => {
      console.log("url", url)
      io.emit('increment count', redirect, count);
      res.redirect(url)
    })
  })

});

server.listen(4000, () => {
    console.log(`Currently listening on Port 4000`)
})
