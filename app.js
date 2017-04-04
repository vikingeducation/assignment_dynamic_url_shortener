var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var expressHbs = require('express-handlebars');
var io = require("socket.io")(server);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ta = require('time-ago')();

var index = require('./routes/index');

var redisClient = require("redis").createClient();

// view engine setup
app.engine('handlebars', expressHbs({
  defaultLayout: 'main',
  helpers: {
    date: (time) => {
      return ta.ago(new Date(Number(time)));
    }
  }
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

console.log(typeof ta.ago(new Date() - 1000));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', client => {

  client.on('increment', (shortUrl) => {
    redisClient.hincrby(shortUrl, "count", 1, (err, count) => {
      io.emit('increment', [shortUrl, count]);
    });
  });
});

server.listen(3000);

module.exports = app;
