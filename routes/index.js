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
    res.redirect(`http://${data}`);
  });
});

router.post('/', function(req, res, next) {
  var userUrl = req.body.url;
  linkShortener.set(userUrl);
  res.redirect('/');
});





module.exports = router;



