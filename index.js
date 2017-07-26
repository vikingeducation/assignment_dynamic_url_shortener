// Express
const express = require('express');
const app = express();

// Socket.io
const server = require('http').createServer(app);
const socket = require('./lib/controllers/sockets')(server);
app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

// Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Static files
app.use('/public', express.static(`${__dirname}/public`));

// Router
const router = require('./lib/controllers/routes')(socket);
app.use('/', router);

// Start server!
const env = require('./env');
server.listen(env.port, env.hostname, () => {
  console.log('Cooking with gas!');
});
