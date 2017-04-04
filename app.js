const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const {storeUrl, getUrls} = require("./link_shortener");

//function takes url
//hashes url
//stores hash as key and url as value in redis
//link_shortener will store and retieve

//app.get('/', (req, res) => {
	getUrls()
	.then((data) => {
		console.log(data);
	});
//})