var express = require('express');
var router = express.Router();
var linkShortener = require('../lib/linkShortener');

/* GET home page. */
router.get('/', function(req, res, next) {
  var array = linkShortener('www.google.com');
  console.log(array);
  res.render('index', { title: 'Express' });
});

module.exports = router;
