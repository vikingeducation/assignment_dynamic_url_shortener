const router = require('./routes');
const env = require('./env');
const bodyParser = require('body-parser');

const express = require('express');
const exphbs = require('express-handlebars');

let app = express();
const server = require('http').createServer(app);

let socket = require('./socket')(server);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/socket.io', express.static(`${__dirname}/public`));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

app.listen(env.port, env.hostname, () => {
  console.log('Cooking with gas!');
});
