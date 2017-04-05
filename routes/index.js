var express = require("express");
var router = express.Router();

var {
  flush,
  getKeys,
  linkShortener,
  getInfo,
  createUrls,
  incrementCount
} = require("../lib/linkShortener");

router.get("/", function(req, res, next) {
  getKeys().then(createUrls).then(allUrls => {
    res.render("index", { allUrls });
  });
});

router.get("/:shortUrl", (req, res) => {
  var shortUrl = req.params.shortUrl;
  getInfo(shortUrl).then(array => {
    let url = array[0];
    res.redirect(`http://${url}`);
  });
});

router.post("/submit", function(req, res, next) {
  var url = req.body.url;
  if (url.length) {
    var shortUrl = linkShortener(url);
    getInfo(shortUrl).then(data => {
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
