const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const home = require('./routes/home.js');
const create = require('./routes/create.js');


app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(`${__dirname}/public`));
app.use('/socket.io',express.static(__dirname + 'node_modules/socket.io-client/dist/'))


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/home', home);
app.use('/create', create);





server.listen(3000, () => {
  console.log('Listening to port 3000');
});
