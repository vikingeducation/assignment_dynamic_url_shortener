const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const morganToolkit = require('morgan-toolkit')(logger);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const helpers = require('./helpers');
const cookieSession = require('cookie-session');
const flash = require('express-flash-messages');
const randomstring = require('randomstring');


const index = require('./routes/index');

// view engine setup
const hbs = exphbs.create({
  helpers: helpers,
  defaultLayout: 'main.hbs',
  partialsDir: 'views/partials/',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('Handlebars', hbs);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/socket.io',express.static(path.join(__dirname, 'node_modules/socket.io-client/dist/')));
app.use(logger('short'));
app.use(morganToolkit());
app.use(flash());

app.use(cookieSession({
  name: 'session',
  keys: [randomstring.generate()]
}));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

module.exports = app;
