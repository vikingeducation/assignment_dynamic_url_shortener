var express = require("express");
var router = express.Router();
var shortener = require("../modules/url-shortener.js");

/* GET home page. */
router.get("/", function(req, res, next) {
	shortener
		.buildObjforRender()
		.then(urlArr => {
			res.render("index", { urlArr });
		})
		.catch(err => {
			console.error(err);
		});
});

//POST a new shortend url
router.post("/", (req, res) => {
	shortener.shorten(req.body.url);
	res.redirect("back");
});

//when you click url link
router.get("/id/:id", (req, res) => {
	var urlId = req.params.id;
	var url;
	shortener.iterateCount(urlId);
	shortener.queryForUrls(urlId).then(arr => {
		url = arr.url;
		res.redirect(`http://${url}`);
	});
});

module.exports = router;
