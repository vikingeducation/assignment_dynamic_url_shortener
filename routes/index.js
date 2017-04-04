const redis = require('redis');
const redisClient = redis.createClient();
var linkShortener = require('../lib/linkShortener');


var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let baseUrl = req.headers.referer
  linkShortener.getUrlPairs()
  .then((urlPairs) => {
      res.render('index', { title: 'Express', urlPairs, baseUrl });
  });
});

router.get('/:uniqueID', function(req, res, next){
  let uniqueID = req.params.uniqueID;
  linkShortener.hget(uniqueID, 'url')
  .then((data) => {
    console.log(`data ${data}`);
    res.redirect(`http://${data}`);
  });
});

router.post('/', function(req, res, next) {
  var userUrl = req.body.url;
  //Scrub for just url
  var urlNoProtocol = userUrl.replace(/^https?\:\/\//i, "");
  linkShortener.set(urlNoProtocol);
  res.redirect('/');
});





module.exports = router;



