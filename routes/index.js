const redis = require('redis')
const redisClient = redis.createClient()

var linkShortener = require('../lib/linkShortener');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // show all relevant full urls and shortened urls and pass to hbs
  redisClient.keys('*', (err, data) => {
    //Some helper function that takes keys and returns an object or key/value pairs
    let urlPairs = [];
    
    data.forEach((key) => {
        redisClient.get(key, (err, value) => {
          urlPairs.push({ key: value });
          
        });

      
    });
    
    
    
    res.render('index', { title: 'Express', urlPairs })
  });
});

router.post('/', function(req, res, next) {
  var userUrl = req.body.url;
  linkShortener.checkUrl(userUrl)
  .then((exists) => {
    if (!exists) linkShortener.set(userUrl);
  }).then(() => {
    res.redirect('/');
  })
});

module.exports = router;


// app.get('/', (req, res) => {
// redisClient.incr('visitor-count', (err, count) => {
//   res.send(`Visitor Count: ${count}`)
// })
// })