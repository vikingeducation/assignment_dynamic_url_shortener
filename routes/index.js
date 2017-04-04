const redis = require('redis')
const redisClient = redis.createClient()

var linkShortener = require('../lib/linkShortener');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // show all relevant full urls and shortened urls and pass to hbs
  linkShortener.getUrlPairs()
  .then((urlPairs) => {
      res.render('index', { title: 'Express', urlPairs });
  });
});

router.get('/:uniqueID', function(req, res, next){
  
  let uniqueID = req.params.uniqueID;
  
  //grab from redis database
  linkShortener.hget(uniqueID, 'url')
  .then((data) => {
    res.redirect(`http://${data}`);
  });
});
// {
//   nytimes.com: xyz
// }

// {
//   xyz: nytimes.com
// }
router.post('/', function(req, res, next) {
  var userUrl = req.body.url;
  linkShortener.set(userUrl);
  res.redirect('/');
});

// update post request so that when we set the hashed URL, we also set the inverse key/value pair
module.exports = router;


// app.get('/', (req, res) => {
// redisClient.incr('visitor-count', (err, count) => {
//   res.send(`Visitor Count: ${count}`)
// })
// })