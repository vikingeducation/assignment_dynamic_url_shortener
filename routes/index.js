var express = require("express");
var router = express.Router();
var {
  flush,
  getKeys,
  linkShortener,
  getInfo,
  incrementCount
} = require("../lib/linkShortener");

/* GET home page. */
router.get("/", function(req, res, next) {

  const urlInfo = [];
  var p = getKeys();
  p.then(data => {
    data.forEach(key => {
      var info = getInfo(key);
      info.then(array => {
        urlInfo.push({
          short: key,
          original: array[0],
          count: array[1]
        });
      });
    });
    res.render("index", { urlInfo });
  });
});

router.get('/:shortUrl', (req, res) => {
  var shortUrl = req.params.shortUrl;
  incrementCount(shortUrl);
  getInfo(shortUrl).then(array => {
    let url = array[0];
    res.redirect(url);
  })
});

router.post("/submit", function(req, res, next) {
  var url = req.body.url;
  var shortUrl = linkShortener(url);
  var p = getInfo(shortUrl);
  p.then(data => {
    // res.render("index", { shortUrl, data });
    res.redirect("/");
  });
});

module.exports = router;
