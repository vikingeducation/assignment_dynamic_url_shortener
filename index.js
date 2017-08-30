const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const linkShortner = require("./modules/link-shortner");
const shortId = require("shortid");

var getIndex = function (list, value) {
  var index = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i] === value) {
      index = i;
    }
  }
  return index;
}

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
  linkShortner.setSite(sentUrl,shortUrl);
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

    const index = getIndex(shortSiteList, (req.params.shortName));

    res.redirect("http://" + fullSiteList[index])
  })

})

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on("newClick", function (data) {
      Promise.resolve(
       linkShortner.getShortenSites()
      ).then( (values) => {
        const index = getIndex(values[0], data.classOfTarget);
        //increase count
        linkShortner.increaseClickSite(index, data.countTarget);
        io.emit('newCount', {data})
      })

    });
  });


server.listen(3000);
