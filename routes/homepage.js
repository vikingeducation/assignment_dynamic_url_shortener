const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const redis = require('redis');
const client = redis.createClient();

const LS = require('../services/link-shortener');

ROUTER.get('/:id', (req, res) => {
  let id = req.params.id;
  client.hgetall(id, (err, object) => {
    let newCount = (Number( object.viewCount ) + 1).toString();
    client.hset(id, 'viewCount', newCount);

    res.redirect( object.fullUrl );
  });
});


ROUTER.get('/', (req, res) => {
  client.lrange('hashIds', 0, -1, function(err, reply) {
    let urlIds = reply;
    let allUrls = [];

    urlIds.forEach( (urlId) => {
      client.hgetall( urlId, (err, object) => {
        if( object ) {
          allUrls.push( {id: urlId, fullUrl: object.fullUrl, viewCount: object.viewCount } )
        }
      });
    });
    res.render('partials/index', { allUrls });
  });
});

ROUTER.post('/', (req, res) => {
  LS.createURL('hashIds', req.body.url);
  res.redirect("/");
});
//
module.exports = ROUTER;
