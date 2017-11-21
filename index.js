const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("redis");
const redisClient = redis.createClient();

const app = express();
let visited = [];
let links = [];
let counts =[]
const hbs = expressHandlebars.create({
  defaultLayout: "main"
  // helpers: helpers.registered
});

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  redisClient.KEYS("*", (err, keys) => {
      console.log("database keys" + keys);
      for (var i = 0; i < keys.length; i++) {
       redisClient.hgetall(keys[i], (err, url) => {
        //console.log("This is the data:" + url["link"]);
        
        if (url) {
          links.push(url["link"])
          counts.push(url["count"])
          console.log("this is it:" + url["count"])
          console.log("these are the:" +links)
          console.log("this is it:" + url["link"])

        }

        }) 
      }

    });

  redisClient.incr("visitor-count", (err, count) => {
    console.log(links)
    res.render("form", {links: links, counts: counts});
    //
  });

});

app.post("/postinputurl", (req, res) => {
  //res.redirect("back")
  let url, id;
  id = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

  url= req.body.inputurl;
  let count= 0;
  redisClient.HMSET(id, {
    "link": url,
    "count": "0"
  }, (err, response) => {
    if (err) {
      console.log("error");
    } else {
      
      res.render("form", { res: id });


    }
  });

})


  /*redisClient.set(id, url, (err, response) => {
    if (err) {
      console.log("error");
    } else {
      res.render("form", { res: id });
      console.log(id);
    }
  });*/



app.get("/:id", (req, res) => {
  let id = req.params.id;
  console.log("id: " + id);
  //let redirect;
  /*var geturl = new Promise((resolve, reject) => {*/
  redisClient.hgetall(id, function(err, url) {
    console.log("url object: " + url);

    if (url["link"].slice("")[0]==="h"){
    /*let redirect = url;*/

      let num = (Number(url["count"]) + 1);
      //console.log(visited)
      /*url["count"]=  num*/;
      redisClient.HMSET(id, {
        "link": url["link"],
        "count": num
        }, (err, response) => {})

      res.redirect(url["link"]);
    } else {
    res.redirect("/")
    /*resolve(url);*/
  }
});



  /*});*/
  /*geturl.then(url => {
    res.redirect(url);
  });*/

});

app.listen(3000, () => {
  console.log("server has started");
});
