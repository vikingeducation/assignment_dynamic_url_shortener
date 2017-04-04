var express = require("express");
var router = express.Router();
var {
  flush,
  getKeys,
  linkShortener,
  shortenedLinkInfo
} = require("../lib/linkShortener");
// var io = require("socket.io")(server);

/* GET home page. */
router.get("/", function(req, res, next) {

  var p = getKeys();
  const urlInfo = [];
  p.then(data => {
    data.forEach(key => {
      var info = shortenedLinkInfo(key);
      info.then(array => {
        urlInfo.push({
          shortened: key,
          original: array[0],
          count: array[1]
        });
      });
    });
    res.render("index", { urlInfo });
  });
});

// io.on("connection", client => {
  

// });

router.post("/submit", function(req, res, next) {
  var url = req.body.url;
  var shortUrl = linkShortener(url);
  var p = shortenedLinkInfo(shortUrl);
  p.then(data => {
    // res.render("index", { shortUrl, data });
    res.redirect("/");
  });
});

module.exports = router;
