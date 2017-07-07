const linkShortner = require('./modules/link-shortener.js');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('./socket.io', express.static(__dirname + "node_modules/socket.io-client/dist/"));

app.get('/', (req, res) => {
    
    res.sendFile(__dirname + "/index.html");
    
    
    //Testing the linkShortner module below.

    //linkShortner.storeUrl('www.ign.com');

    //const count = linkShortner.getCount('www.google.com');
    //linkShortner.getUrlObj('www.google.com');
    //linkShortner.incrCount('www.google.com');

    //linkShortner.getAll();

    //console.log(`\n ${count} ${url}`);
});

io.on('connection' , client => {

    client.on('addURL', () => {
        console.log("hello");
    });
})


app.listen(3000, () => {
    console.log('Listening');
})