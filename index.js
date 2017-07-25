const app = require('express')();
const router = require('./routes');
const bodyParser = require('body-parser');
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

app.listen(3000);
