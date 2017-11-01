"use strict";

const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const port = 4000;

app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.render("results", { something: "my content!" }); // render() for views, sendFile() for not
});

app.listen(port, () => {
	console.log(`listening on localhost:${port}`);
});
