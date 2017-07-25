const router = require('express').Router();
const shortener = require('./lib/shortener');

router.get('/', (req, res) => {
  // get all counts
  let idArrayPromise = shortener.getAllCounts();

  // display page
  idArrayPromise
    .then(idArray => {
      idArray = idArray.map(urlObject => {
        return {
          id: Object.keys(urlObject)[0],
          count: Object.values(urlObject)[0]
        };
      });
      res.render('index', { urls: idArray });
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
  let id = req.params.id;
  let updatePromise = shortener.updateUrl(id);
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

{
  id: id;
  count: count;
}
