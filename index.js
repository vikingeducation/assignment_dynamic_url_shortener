const express = require('express')
const app = express()
const server = require('http').createServer(app)
const handlebars = require('express-handlebars')
const io = require('socket.io')(server)
const redisClient = require('redis').createClient();
const bodyParser = require('body-parser');

const {
  getLink,
  getAllLinks,
  saveLink
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
    console.log(urls);
    res.render('index', { urls: urls });
  });
})

app.post('/update', (req, res) => {
  console.log(req.body.link)
  let url = req.body.link;
  saveLink(url);
  res.redirect('back');
});


app.get('/r/:id', function(req, res) {
  let redirect = req.params.id;
  console.log("req.params.id", redirect)
  getLink(redirect).then(url => {
    console.log(url)
    res.redirect(url)
  })
});
// app.get('/r/:hash', (req, res) => {
//   let redirect = req.params.hash;
//   console.log("req.params.redirect", redirect)
//   getLink(redirect).then(url => {
//     console.log(url)
//     res.redirect(url)
//   })
//
// })

server.listen(4000, () => {
    console.log(`Currently listening on Port 4000`)
})
