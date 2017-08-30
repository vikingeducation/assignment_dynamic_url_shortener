const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const linkShortner = require("./modules/link-shortner");
const shortId = require("shortid");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

// Set up handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: 'views/'
}));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {

  Promise.all([
    linkShortner.getFullSites(),
    linkShortner.getShortenSites(),
    linkShortner.getClickSites()
  ]).then ( (values) => {
    let fullSiteList = values[0]
    let shortSiteList = values[1]
    let clickSiteList = values[2]
    //console.log(values);
    res.render("index", {fullSiteList, shortSiteList, clickSiteList});
  })

});

app.get("/newUrl", (req, res) => {
  const sentUrl = req.url.slice(19);
  const shortUrl = shortId.generate();
  linkShortner.setSite(sentUrl, "/sUrl/" + shortUrl);
  res.redirect("back");
})

app.get("/sUrl/:shortName", (req, res) => {
  Promise.all([
    linkShortner.getFullSites(),
    linkShortner.getShortenSites(),
    linkShortner.getClickSites()
  ]).then ( (values) => {
    let fullSiteList = values[0]
    let shortSiteList = values[1]
    let clickSiteList = values[2]
    var index = 0;
    console.log(shortSiteList)
    for (var i = 0; i < shortSiteList.length; i++) {
      if (shortSiteList[i] === ("/sUrl/" + req.params.shortName)) {
        index = i;
      }
    }

    //increase count
    linkShortner.increaseClickSite(index, clickSiteList[index]);
    res.redirect("http://" + fullSiteList[index])
  })

})

server.listen(3000);
