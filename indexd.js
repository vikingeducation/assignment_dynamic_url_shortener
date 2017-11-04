"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const randomstring = require("randomstring");
const redis = require("./lib/redis-lib");

const APP_URL_KEY = "urlKey";
const APP_CLICK_KEY = "clickKey";
const SHORTURL_LENGTH = 5;
const PORT = 4000;

//setup handlebars
app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "maind" }));
app.set("view engine", "handlebars");

//body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

//register routes
app.get("/", (req, res) => {
	res.render("results", { test: "test content" }); // render() for views, sendFile() for not
});

app.get("/:shorturl", (req, res) => {
	let shortUrl = req.params.shorturl;
	redis
		.incrementCount(APP_CLICK_KEY, shortUrl)
		.then(data => {
			console.log(`count incremented to: ${data}`);
			return redis.getOriginalUrl(APP_URL_KEY, shortUrl);
		})
		.then(data => {
			let link = data;
			res.redirect(link);
		})
		.catch(err => {
			console.log(err);
		});
});

app.post("/update", (req, res) => {
	let originalUrl = req.body.formOrigUrl; // console.log(originalUrl);
	let shortUrl = randomstring.generate({
		length: SHORTURL_LENGTH,
		charset: "alphabetic"
	});
	let urls,
		counts = [];

	redis
		.writeUrl(APP_URL_KEY, originalUrl, shortUrl)
		.then(data => {
			if (data) console.log("wrote OK");
			return redis.initCount(APP_CLICK_KEY, shortUrl);
		})
		.then(data => {
			if (data) console.log("init count OK");
			return redis.getUrls(APP_URL_KEY);
		})
		.then(data => {
			urls = data;
			return redis.getCounts(APP_CLICK_KEY);
		})
		.then(data => {
			let host = req.get("host");
			counts = data;
			// console.log(counts); // console.log(urls); // res.redirect("back");
			res.render("results", {
				myCounts: counts,
				myUrls: urls,
				myHost: host
			});
		})
		.catch(err => {
			console.log(err);
		});
});

app.listen(PORT, () => {
	console.log(`listening on localhost:${PORT}`);
});
