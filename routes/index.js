var express = require('express');
var router = express.Router();
var linkShortener = require('../lib/linkShortener');

/* GET home page. */
router.get('/', function(req, res, next) {
  var p = linkShortener('www.google.com');
  p.then(data => {
    res.render('index');
  });
});

module.exports = router;
