const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

ROUTER.get('', (req, res) => {
  res.render('partials/index', {message: "hello" });
});


ROUTER.post('', (req, res) => {
  console.log('success')
  res.redirect("/");
});

module.exports = ROUTER;
