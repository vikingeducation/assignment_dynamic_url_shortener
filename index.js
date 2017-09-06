const { storeUrl, getUrlObj, getAllURLs, deleteAll, deleteURL, incrCount, } = require('./modules/link-shortener.js');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

let socketClient;


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

//setup style css
app.use(express.static(__dirname + '/public'));

//Load all the data from redis on first page load
app.get('/', (req, res) => {
    getAllURLs()

        .then((data) => {

           let urlList = data.map(element => (getUrlObj(element))); //arra.map is cool

            return Promise.all(urlList);//return all promises so able to chain another .then
        })

        .then((urlArray) => {
            console.log(urlArray);
            res.render('index', {
                urls: urlArray
            });
//            res.render('index', urlArray);
        })

        .catch((reject) => {
            console.log(reject);
        });
});

io.on('connection', client => {

    let urlObj = {};
    //When submit is clicked, addURL event is handled here, after adding to redis, emit event to actually add
    //the link to the html itself to display for user
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

    //on delete event handler, clear redis
    client.on('removeAll', () =>{
        deleteAll();
        console.log('All data in redis has been deleted');
    });

    //assign the client globally, so can be used in express method get later on
    socketClient = client;

});
//increment counter and emit event to client side javascript via the global socket client assigned in io.on connection method.
app.get('/r/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;

    incrCount(shortURL)
    
    .then((result) => {
        return getUrlObj(shortURL);
    })

    .then((result) => {

        if(socketClient){
            io.emit("incrCount", result);
        }
        res.redirect(`http://${shortURL}`);
    });

});



server.listen(3000);
