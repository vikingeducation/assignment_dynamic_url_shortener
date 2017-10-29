const router = require('express').Router();
const { getURLs, getFullURL } = require('../helpers/url-shortener.js');

router.get('/', (req, res) => {
  const urls = [];

  getURLs().then((data) => {
    data.forEach((id) => {
      urls.push(getFullURL(id));
    });

    Promise.all(urls).then((data) => {
      res.render('index', {
        urls: data,
        baseURL: 'http://localhost:3000'
      });
    });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  getFullURL(id)
    .then((obj) => {
      res.redirect(obj.longURL);
    })
});



module.exports = router;
