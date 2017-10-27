const express = require('express');
const bodyParser = require('body-parser');
const { getUrl, setUrl } = require('./models/urlHandler');

const app = express();

// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/views/index.html`);
//   res.sendFile('./views/index.html');
// });

// app.get('/', (req, res) => {
//   const url = 'm3er3';
//   getUrl(url, (value) => {
//     console.log(value);
//     res.send(value);
//   });
// });

// app.get('/', (req, res) => {
//   const url = 'looooooooooongUrl';
//   setUrl(url, (value) => {
//     console.log(value);
//     res.send(value);
//   });
// });

app.listen(3000, () => {
  console.log('Listening at port 3000');
});
