const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const morganToolkit = require('morgan-toolkit')(logger);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const helpers = require('./helpers');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
const hbs = exphbs.create({
  helpers: helpers,
  defaultLayout: 'main.hbs',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('short'));
app.use(morganToolkit());

app.use('/', index);
app.use('/users', users);

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
