const express = require('express');
const router = express.Router();
const shortenLink = require('../lib/link-shortener');
const redis = require("redis");
const redisClient = redis.createClient();

/* GET home page. */
router.get('/', (req, res, next) => {
  redisClient.keys('long:*', (err, keys) => {
    var allLinks = {};

    if (keys.length == 0) {
      res.render('index', { noLinks: true } );
    } else {
      keys.forEach((key) => {
        redisClient.hgetall(key, (err, object) => {
          if (err) throw err;
          allLinks[key.slice(5)] = object;
          if (key == keys[keys.length -1]) {
            res.render('index', { allLinks } );
          }
        });
      });
    }
  });
});

router.get('/:shortLink', (req, res) => {
  const socket = require('../lib/socket_service');
  const io = socket.io;

  var shortLink = req.url.slice(1);

  redisClient.keys('long:*', (err, keys) => {
    if (keys.length == 0) {
      req.flash('error', 'The short link you tried to access does not exist.');
      res.redirect('/');
    } else {
      var found = false;
      keys.forEach((key) => {
        redisClient.hgetall(key, (err, props) => {
          if (props.short == shortLink) {
            found = true;
            // increment click count
            redisClient.hmset(key, 'clicks', parseInt(props.clicks) + 1);

            io.emit('increment-clicks', shortLink + "-clicks");

            // redirect to long link location
            res.redirect(key.slice(5));
          } else {
            if (key == keys[keys.length - 1] && !found) {
              req.flash('error', 'The short link you tried to access does not exist.');
            }
          }
        });
      });
    }
  });
});

router.post('/', (req, res) => {
  var link = req.body.url;

  // validate link
  let urlRegex = /^[\w:\/\.]+\.[a-zA-z]{2,3}$/g;
  var validLink = urlRegex.test(link);

  if (validLink) {
    if (!link.startsWith('http')) {
      link = 'http://' + link;
    }

    // check if it already exists
    redisClient.keys('long:*', (err, keys) => {
      if (keys.indexOf('long:' + link) > -1) {
        req.flash('error', 'That link was already shortened');
        res.redirect('/');
      } else {
        // create short url
        shortenLink(link);
        res.redirect('/');
      }
    });
  } else {
    req.flash('error', 'Invalid link. Please try again.');
    res.redirect('/');
  }
});

module.exports = router;
