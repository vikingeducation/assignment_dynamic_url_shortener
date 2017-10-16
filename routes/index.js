const router = require('express').Router();
const urlShortener = require('../modules/urlShortener.js');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

router.get('/', function(req, res, next) {
  let urls = [];
  urlShortener.getAllURLs().then(data => {
    data.forEach(shortURL => urls.push(urlShortener.getLongURL(shortURL)));
    Promise.all(urls).then(array => res.render('index', {server: 'http://localhost:4600', urls: array}));
  });
});

router.post('/', function(req, res, next) {
  urlShortener.shortenURL(req.body.longURL);
  res.redirect('back');
});

router.get('/:shortURL', function(req, res, next){
  const shortURL = req.params.shortURL;
  console.log(shortURL);
  urlShortener.incrementCount(shortURL);
  urlShortener.getLongURL(shortURL).then(function(obj){
    console.log(obj);
    io.emit("updateCount", obj);
    res.redirect(obj.longURL);
  });
});

module.exports = router;