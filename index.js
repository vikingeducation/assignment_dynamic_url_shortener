"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const favicon = require("serve-favicon");
const path = require("path");

const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const randomstring = require("randomstring");
const redis = require("./lib/redis-lib");

const APP_URL_KEY = "urlKey";
const APP_CLICK_KEY = "clickKey";
const SHORTURL_LENGTH = 5;
const PORT = 3000;

//setup handlebars
app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setup middleware
app.use(bodyParser.urlencoded({ extended: false })); //body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body
app.use(express.static(__dirname + "/public"));
//was getting favicon.ico error on chrome browser. resolved by simply mounting favicon middleware
app.use(favicon(path.join(__dirname, "public/favicon", "favicon.ico")));

// this code may not be useful
// see here for app.use() usage: https://expressjs.com/en/api.html#path-examples
// app.use(
// 	"/socket.io",
// 	express.static(__dirname + "node_modules/socket.io-client/dist/")
// );

// handle google chrome favicon.ico bug (currently using chrome 62)
// google chrome browser is bugily passing favicon.ico to my route causing program to crash
// bug desc here: https://bugs.chromium.org/p/chromium/issues/detail?id=39402
// and here: https://stackoverflow.com/questions/1003350/why-is-chrome-searching-for-my-favicon-ico-when-i-serve-up-a-file-from-asp-net-m
// potential solution here: https://stackoverflow.com/questions/27117337/exclude-route-from-express-middleware
// note: no issues on firefox 56, edge 40
// conclusion: resolved by using favicon. fully resolves google chrome bug
// DC, 2017-11-09

//register routes
app.get("/", (req, res) => {
	res.render("results", { test: "test content" }); // render() for views, sendFile() for static files
});

//route for when user consumes short url link
app.get("/:shorturl", (req, res) => {
	io.on("connection", socket => {
		console.log("a user connected at /:shorturl");
		socket.on("disconnect", () => {
			console.log("--> disconnected at /:shorturl");
		});
	});
	let shortUrl = req.params.shorturl;
	console.log("shortUrl clicked = " + shortUrl);
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

//route for when user submits original long url
app.post("/update", (req, res) => {
	io.on("connection", socket => {
		console.log("a user connected at /update");
		socket.on("disconnect", () => {
			console.log("--> disconnected at /update");
		});
	});
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

io.on("connection", socket => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("--> disconnected");
	});
});

//when using socket.io make sure you change app --> server
server.listen(PORT, () => {
	console.log(`listening on localhost:${PORT}`);
});
