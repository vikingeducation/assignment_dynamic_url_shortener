var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
	//MAKE REDIS QUERY for all urls

	//parse into obj, then feed into res.render

	res.render("index", { title: "Express" });
});

router.post("/", (req, res) => {
	//shorten url
	//store in redis
	res.redirect("back");
});

router.get("/id", (req, res) => {
	//parse the body id
	//iterate the count and
	//res.redirect(url)
});

module.exports = router;
