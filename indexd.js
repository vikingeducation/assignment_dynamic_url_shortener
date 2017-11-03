"use strict";

const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const randomstring = require("randomstring");
const redis = require("./lib/redis-lib");
const port = 4000;

//body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body
app.use(bodyParser.urlencoded({ extended: false }));

//setup handlebars
app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "maind" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.render("results", { test: "test content" }); // render() for views, sendFile() for not
});

app.post("/update", (req, res) => {
	let originalUrl = req.body.formOrigUrl; // console.log(originalUrl);
	let shortUrl = randomstring.generate({ length: 5, charset: "alphabetic" });
	let urls,
		counts = [];

	redis
		.writeUrl(originalUrl, shortUrl)
		.then(data => {
			if (data) console.log("wrote OK");
			return redis.initCount(shortUrl);
		})
		.then(data => {
			if (data) console.log("init count OK");
			return redis.getUrls();
		})
		.then(data => {
			urls = data;
			return redis.getCounts();
		})
		.then(data => {
			counts = data;
			console.log(counts);
			console.log(urls); // res.redirect("back");
			res.render("results", { myCounts: counts, myUrls: urls });
		})
		.catch(err => {
			console.log(err);
		});
});

app.listen(port, () => {
	console.log(`listening on localhost:${port}`);
});
