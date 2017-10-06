const express = require('express');
const router = express.Router();
const shortenLink = require('../lib/link-shortener');
const redis = require("redis");
const client = redis.createClient();

/* GET home page. */
router.get('/', (req, res, next) => {
  client.keys('short:*', (err, keys) => {
    var allLinks = {};

    if (keys.length == 0) {
      res.render('index', { noLinks: true } );
    } else {
      keys.forEach((key) => {
        client.hgetall(key, (err, object) => {
          if (err) throw err;
          allLinks[key] = object;
          if (key == keys[keys.length -1]) {
            res.render('index', { allLinks } );
          }
        });
      });
    }
  });
});

router.get('/:shortLink', (req, res) => {
  var shortLink = 'short:' + req.url.slice(1);

  client.hgetall(shortLink, (err, props) => {
    if (props) {
      // increment click count
      client.hmset(shortLink, 'clicks', parseInt(props.clicks) + 1);

      // redirect to long link location
      res.redirect(props.long);
    } else {
      req.flash('error', 'The short link you tried to access does not exist.');
      res.redirect('/');
    }
  });
});

router.post('/', (req, res) => {
  var link = req.body.url;

  // validate link
  let urlRegex = /^[\w:\/\.]+\.[a-zA-z]{2,3}$/g;
  var validLink = urlRegex.test(link);

  if (validLink) {
    // create short url
    shortenLink(link);
    res.redirect('/');
  } else {
    req.flash('error', 'Invalid link. Please try again.');
    res.redirect('/');
  }
});

module.exports = router;
