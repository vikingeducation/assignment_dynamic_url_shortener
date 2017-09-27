var express = require("express");
var router = express.Router();
var shortener = require("../modules/url-shortener.js");

var allUrlDataArr = [];

/* GET home page. */
router.get("/", function(req, res, next) {
	shortener
		.getAllKeys()
		.then(keys => {
			keys.forEach(function(element) {
				shortener
					.queryForUrls(element)
					.then(data => {
						var obj = {
							key: element,
							url: data.url,
							clicks: data.clicks
						};
						//console.log("obj", obj);
						allUrlDataArr.push(obj);
						return allUrlDataArr;
					})
					.catch(err => {
						console.error(err);
					});
			});
			return allUrlDataArr;
		})
		.then(thatData => {
			setTimeout(function() {
				console.log("allUrlDataArr over here", thatData);
				res.render("index", { title: thatData });
			}, 500);
		})
		.catch(err => {
			console.error(err);
		});
});

router.post("/", (req, res) => {
	//shorten url
	//store in redis
	res.redirect("back");
});

router.get("/:id", (req, res) => {
	//parse the body id
	//iterate the count and
	//res.redirect(url)
});

module.exports = router;
