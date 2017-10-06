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
  // redirect to long link location
});

router.post('/', (req, res) => {

  // create short url

  res.redirect('/');
});

module.exports = router;
