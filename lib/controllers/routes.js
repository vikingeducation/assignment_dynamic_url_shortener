const router = require('express').Router();
const shortener = require('../shortener');

router.get('/', (req, res) => {
  // get all counts
  shortener
    .retrieve()
    .then(urls => {
      res.render('index', { urls: urls });
    })
    .catch(err => {
      console.error(err.stack);
      res.render('index');
    });
});

router.post('/', (req, res) => {
  // pull new url from body
  // initialize new id
  shortener.shorten(req.body.url);
  // redirect home
  res.redirect('/');
});

router.get('/:id', (req, res) => {
  // increment the counter
  shortener
    .update(req.params.id)
    .then(url => {
      res.redirect(url.originalUrl);
    })
    .catch(err => {
      // redirect home on error
      console.error(err.stack);
      res.redirect('/');
    });
});

module.exports = router;
