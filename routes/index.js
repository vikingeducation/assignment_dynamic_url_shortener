var express = require("express");
var router = express.Router();
var shortener = require("../modules/url-shortener.js");

/* GET home page. */
router.get("/", function(req, res, next) {
	shortener
		.buildObjforRender()
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
});

//POST a new shortend url
router.post("/", (req, res) => {
	//shorten url
	shortener.shorten(req.body.url);
	//store in redis
	res.redirect("back");
});

//when you click url link
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
