const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const home = require('./routes/home.js');
const create = require('./routes/create.js');

const app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(`${__dirname}/public`));



app.use('/', home);
app.use('/create', create);




app.listen(3000, () => {
  console.log('Listening to port 3000');
});
