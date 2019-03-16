const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const redis = require('redis');
const client = redis.createClient();

const LS = require('../services/link-shortener');


ROUTER.get('/', (req, res) => {
  LS.getAll(res);
  // LS.deleteAllTemp();
});

ROUTER.post('/', (req, res) => {
  LS.createURL('hashIds', req.body.url);
  res.redirect("/");
});

ROUTER.get('/:id', (req, res) => {
  console.log("ROUTER.get('/:id' ran" )
  LS.getExternalWebsite(req.params.id, res);
});
//
module.exports = ROUTER;
