var linkShortener = require('../lib/linkShortener');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // use the standard redis stuff
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var userUrl = req.body.url;
  linkShortener.checkUrl(userUrl)
  .then((exists) => {
    if (!exists) linkShortener.set(userUrl);
    return linkShortener.get(userUrl);
  }).then(() => {
    res.redirect('/');
  })
});

module.exports = router;
