const linkShortner = require('./modules/link-shortener.js');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    //Testing the linkShortner module below.

    linkShortner.storeUrl('www.ign.com');

    //const count = linkShortner.getCount('www.google.com');
    linkShortner.getUrlObj('www.google.com');
    //linkShortner.incrCount('www.google.com');

    //linkShortner.getAll();

    //console.log(`\n ${count} ${url}`);
    res.end()
});

app.listen(3000, () => {
    console.log('Listening');
})