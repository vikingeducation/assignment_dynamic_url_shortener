const router = require('express').Router();
const { makeShortenedURL } = require('../helpers/url-shortener.js');

router.post('/', (req, res) => {
  const { fullURL } = req.body;

  makeShortenedURL(fullURL).then((reply) => {
    res.redirect('back');
  });
});


module.exports = router;
