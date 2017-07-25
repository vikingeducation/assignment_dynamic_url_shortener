const router = require('express').Router();
const shortener = require('./lib/shortener');
const env = require('./env');

router.get('/', (req, res) => {
  // get all counts
  let idArrayPromise = shortener.getAllCounts();

  // display page
  idArrayPromise
    .then(idObject => {
      let urls = [];
      for (let id in idObject) {
        let fqu = `http://${req.hostname}:${env.port}/${id}`;
        urls.push({
          url: fqu,
          count: idObject[id]
        });
      }
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
  console.log(req.params);
  // increment the counter
  let id = req.params.id;
  let updatePromise = shortener.updateUrl(id);
  // get the actual url from our data store and redirect the user to it
  updatePromise
    .then(url => {
      console.log(url);
      // res.redirect(url);
    })
    .catch(err => {
      // redirect home on error
      console.error(err.stack);
      res.redirect('/');
    });
});

module.exports = router;
