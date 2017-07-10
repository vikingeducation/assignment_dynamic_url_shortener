const { storeUrl, getUrlObj, getAllURLs, deleteAll, deleteURL, incrCount, } = require('./modules/link-shortener.js');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(
    "/socket.io",
    express.static(__dirname + "node_modules/socket.io-client/dist/")
);

//set up handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: 'views/'
}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {

    let urlList = [];

    getAllURLs()

        .then((data) => {

            data.forEach(function (element) {
                urlList.push(getUrlObj(element));
            });

            Promise.all(urlList)

                .then((urlArray) => {
                    res.render('index', urlArray);
                });
        })

        .catch((reject) => {
            console.log(reject);
        });
});

app.get('/r/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;

    incrCount(shortURL).then((result) => {
        return getUrlObj(shortURL);
    })

        .then((result) => {
            io.emit('incrCount', result);

            res.redirect(`http://${shortURL}`);
        });

});



io.on('connection', client => {

    let urlObj = {};
    
    io.emit('incrCount', result);

    client.on('addURL', (url) => {

        storeUrl(url)

            .then((result) => {
                console.log(result);
                return getUrlObj(url);
            })

            .then((result) => {
                io.emit('newURL', result);
            })

            .catch((err) => {
                console.log(err);
            });
    });
});


server.listen(3000);
