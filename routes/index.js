var express = require('express');
var router = express.Router();

const url = require('url');
const shorten = require('../lib/link_shortener');
const redisWrapper = require('../lib/redis_wrapper');

/* GET home page. */
router.get('/', function(req, res, next) {
	// Pull params out for routing.
	let path = url.parse(req.path).pathname.slice(1);
	if (path.length > 0) {
		// Fetch all urls from the database.
		redisWrapper.getAllLinks().then(_parseLinks);
	} else {
	}
});

function _parseLinks(urlObject) {
	// Convert urls into array of objects.
	let urls = [];
	for (let long in urlObject) {
		let short = urlObject[long];
		urls.push({
			short: short,
			long: long
		});

		res.render('index', {
			title: 'Dynamic URL Shortener',
			urls: urls
		});
	}
}

module.exports = router;
