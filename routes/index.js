"use strict";

var express = require("express");
var router = express.Router();

const url = require("url");
const redisWrapper = require("../lib/redis_wrapper");

/* GET home page. */
const PAGE_TITLE = "Simplify your links";
router.get("/", function(req, res, next) {
  // Fetch all urls from the database.
  redisWrapper.getAllLinks().then(_parseLinks).then(links => {
    let countObj = redisWrapper.getUrlCounts().then(counts => {
      links = links.map(urlObj => {
        urlObj.count = counts[urlObj.long];
        return urlObj;
      });

      res.render("index", {
        title: PAGE_TITLE,
        urls: links
      });
    });
  });
});

router.get("/:shortId", (req, res) => {
  // Pull params out for routing.
  let urlId = req.params.shortId;
  if (/^favicon/gi.test(urlId)) {
    // This started giving us trouble
    // out of the blue for no reason... TODO: Figure this out.
    res.end();
  } else {
    if (urlId.length > 0) {
      redisWrapper.loadLink(urlId).then(result => {
        if (result !== "Not Found") {
          redisWrapper.incrementUrlCount(result).then(count => {
            res.redirect(result); // TODO: Fix relative paths
          });
        } else {
          res.render("error");
        }
      });
    } else {
      res.render("error");
    }
  }
});

// Convert urls into array of objects.
function _parseLinks(urlObject) {
  let urls = [];
  for (let short in urlObject) {
    let long = urlObject[short];
    urls.push({
      short: short,
      long: long
    });
  }
  return urls;
}

module.exports = router;
