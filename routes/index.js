var express = require('express');
var router = express.Router();

const url = require('url');
const shorten = require('../lib/link_shortener');
const redisWrapper = require('../lib/redis_wrapper');

/* GET home page. */
router.get('/', function(req, res, next) {

	// Fetch all urls from the database.
	redisWrapper.getAllLinks().then(_parseLinks).then((links)=> {
		res.render('index', {
			title: 'Dynamic URL Shortener',
			urls: links
		});
	});
});

router.get('/*', (req, res) => {
	// Pull params out for routing.
	let path = url.parse(req.path).pathname.slice(1);
	console.log(path)
	if (path.length > 0) {
		redisWrapper.loadLink(path).then((result)=>{
			console.log(result)
			if (result !== 'Not Found'){
				res.redirect(result)
			}
		})
	}
})

function _parseLinks(urlObject) {
	// Convert urls into array of objects.
	let urls = [];
	for (let long in urlObject) {
		let short = urlObject[long];
		urls.push({
			short: short,
			long: long
		});
	}
}

module.exports = router;
