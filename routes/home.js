const router = require('express').Router();
const { getURLs } = require('../helpers/url-shortener.js');

router.get('/', (req, res) => {
  getURLs().then((urls) => {
    res.render('index', {
      urls,
      baseURL: 'http://localhost:3000'
    });
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  getURLs().then((urls) => {
    res.redirect(urls[id]);
  });
});



module.exports = router;
