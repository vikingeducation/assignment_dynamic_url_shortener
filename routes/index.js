var express = require("express");
var router = express.Router();
var shortener = require("../modules/url-shortener.js");

/* GET home page. */
router.get("/", function(req, res, next) {
	shortener
		.getAllKeys()
		.then(keys => {
			var allUrlDataArr = [];
			keys.forEach(function(element) {
				shortener
					.queryForUrls(element)
					.then(data => {
						var obj = {
							key: element,
							url: data.url,
							clicks: data.clicks
						};
						console.log("obj", obj);
						allUrlDataArr.push(obj);
						return allUrlDataArr;
					})
					.catch(err => {
						console.error(err);
					});
			});
			return allUrlDataArr;
		})
		.then(urlArr => {
			console.log("allUrlDataArr not timeout", urlArr);

			setTimeout(function() {
				console.log("allUrlDataArr over here", urlArr);
				res.render("index", { urlArr });
			}, 500);
		})
		.catch(err => {
			console.error(err);
		});
	/*
		.then(urlArr => {
			console.log("allUrlDataArr not timeout", urlArr);

			setTimeout(function() {
				console.log("allUrlDataArr over here", urlArr);
				res.render("index", { urlArr });
			}, 500);
		})*/
});

router.post("/", (req, res) => {
	//shorten url
	shortener.shorten(req.body.url);
	//store in redis
	res.redirect("back");
});

router.get("/id/:id", (req, res) => {
	//iterate the count(to do)
	var urlId = req.params.id;
	var url;
	shortener.queryForUrls(urlId).then(arr => {
		url = arr.url;
		res.redirect(`http://${url}`);
	});
});

module.exports = router;
