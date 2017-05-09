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

router.get('/:shortURL', function(req, res, next){
  const shortURL = req.params.shortURL;
  ls.addClick(shortURL);
  ls.lengthenURL(shortURL).then(function(obj){
    res.io.emit("updateCount", obj);
    res.redirect(obj.longURL);
  });
});

router.post('/', function(req, res, next) {
  let shortURL = ls.shortenURL(req.body.originalURL);
  ls.lengthenURL(shortURL).then(function(obj){
    res.io.emit("newLink", obj);
  });
  res.redirect("back");
});

/*

for websockest

add a function to notify client for a new item notifyNew(shortURL) which then looks up
with lengthenURL and hwen promise completes sends that ot the client as the update /
client side it's an HTML append to the table

add a functino to notify client for a new count notifyUpdateCount(shortURL) which then
sends the lengthenURL after promise completes / client side it's an HTML update

*/

module.exports = router;
