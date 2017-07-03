const linkShortner = require('./modules/link-shortener.js');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    linkShortner.storeUrl('www.ign.com');

    const count = linkShortner.getCount('www.google.com');
    const url = linkShortner.getUrl('www.google.com');
    
    linkShortner.getAll();

    console.log(`\n ${count} ${url}`);
    res.end()
});

app.listen(3000, () => {
    console.log('Listening');
})