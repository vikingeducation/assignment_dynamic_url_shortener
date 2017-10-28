const router = require('express').Router();

router.post('/', (req, res) => {
  const { fullURL } = req.body;
  console.log(fullURL);
});


module.exports = router;
