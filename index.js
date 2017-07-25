const app = require('express')();
const router = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

app.listen(3000);
