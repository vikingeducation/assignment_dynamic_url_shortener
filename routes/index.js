var express = require('express');
var router = express.Router();
var { linkShortener, shortenedLinkInfo } = require('../lib/linkShortener');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/submit', function(req, res, next) {
  var url = req.body.url;
  var shortUrl = linkShortener(url);
  var p = shortenedLinkInfo(shortUrl);
  p.then(data => {
    res.render('index', {shortUrl, data});
  });

})

module.exports = router;
