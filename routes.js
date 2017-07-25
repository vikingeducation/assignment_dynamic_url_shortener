const router = require('express').Router();
const shortener = require('./lib/shortener');

router.get('/', (req, res) => {
  // get all counts
  // display page
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
  let updatePromise = shortener.updateUrl(req.params.id);
  // get the actual url from our data store and redirect the user to it
  updatePromise
    .then(url => {
      res.redirect(url);
    })
    .catch(err => {
      // redirect home on error
      console.error(err.stack);
      res.redirect('/');
    });
});

module.exports = router;
