var express = require('express');
var router = express.Router();

const shorten = require('../lib/link_shortener');
const redisWrapper = require('../lib/redis_wrapper');

/* GET home page. */
router.get('/', function(req, res, next) {
	// Fetch all urls from the database.
	redisWrapper.getAllLinks().then(urlObject => {
		// Convert urls into array of objects.
		let urls = [];
		for (let long in urlObject) {
			let short = urlObject[long];
			urls.push({
				short: short,
				long: long
			});
		}
		console.log(urls);

		res.render('index', {
			title: 'Dynamic URL Shortener',
			urls: urls
		});
	});
	//res.status(200).end();
});

module.exports = router;
