const router = require('express').Router();
const shortener = require('./lib/shortener');
const env = require('./env');

router.get('/', (req, res) => {
  // get all counts
  let idArrayPromise = shortener.getAllCountsAndUrls();

  // display page
  idArrayPromise
    .then(([countsObject, urlsObject]) => {
      let urls = [];
      for (let id in countsObject) {
        let fqu = `http://${req.hostname}:${env.port}/${id}`;
        urls.push({
          url: fqu,
          count: countsObject[id],
          originalUrl: urlsObject[id]
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
      if (!url.slice(0, 4) === 'http') {
        url = "http://" + url
      }
      res.redirect(url);
    })
    .catch(err => {
      // redirect home on error
      console.error(err.stack);
      res.redirect('/');
    });
});

module.exports = router;
