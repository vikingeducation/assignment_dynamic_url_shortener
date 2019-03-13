const express = require('express');
const app = express();

// handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs( {defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//redis
const redis = require('redis');
const redisCLient = redis.createClient();

// routers
const homepageRouter = require('./routes/homepage');



app.use('/', homepageRouter);



app.listen(3000);

/*
psuedo code

methods:
  store/create the full URL, along with a shortened version of it,
         with the following statistics options:
            *time created
            *times clicked

  retreieve/get the shortened URL


*/
