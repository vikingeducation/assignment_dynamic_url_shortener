const express = require('express');
const app = express();

// handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs( {defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//redis
// const redis = require('redis');
// const redisCLient = redis.createClient();

//body parser
const bodyParser = require('body-parser');
app.use( bodyParser.urlencoded( {extended: true}) );

// routers
const homepageRouter = require('./routes/homepage');



app.use('/', homepageRouter);
``


app.listen(3000);
