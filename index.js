const app = require('express')();

// Set the default value
redisClient.setnx('count', 0);

app.get('/', (req, res) => {
  // get all counts
  // display page
});

app.get('/:urlId', (req, res) => {
  // increment the counter
  // get the actual url from our data store
  // redirect the user to it
});

app.listen(3000);
