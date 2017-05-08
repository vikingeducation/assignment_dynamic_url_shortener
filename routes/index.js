var express = require('express');
var router = express.Router();
const ls = require('../bin/linkShortener.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let urls = [];
  ls.getURLs().then(function(data) {
    data.forEach(function(shortURL) {
      urls.push(ls.lengthenURL(shortURL));
    })
    Promise.all(urls).then(function(urlArray) {
      res.render('index', {
        title: 'Link Shortener',
        server: 'http://localhost:3000',
        urls: urlArray
      });
    });
  });
});

router.post('/', function(req, res, next) {
  ls.shortenURL(req.body.originalURL);
  res.redirect("back");
});

module.exports = router;
