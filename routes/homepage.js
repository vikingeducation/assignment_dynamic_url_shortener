const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const redis = require('redis');
const client = redis.createClient();

ROUTER.get('/:id', (req, res) => {
  client.hgetall( req.params.id, (err, object) => {
    res.redirect( object.fullUrl );
  });
});


ROUTER.get('', (req, res) => {
  //delete
  // client.del("hashIds")

  client.lrange('hashIds', 0, -1, function(err, reply) {
    let urlIds = reply;
    let allUrls = [];

    urlIds.forEach( (urlId) => {
      client.hgetall( urlId, (err, object) => {
        allUrls.push( {id: urlId, fullUrl: object.fullUrl } )
      });
    });
    res.render('partials/index', { allUrls });
  });
});


ROUTER.post('', (req, res) => {
  client.lrange('hashIds', 0, -1, function(err, reply) {
    var id = reply.length.toString();

    client.lpush(["hashIds", id], function(err,reply) { });
    client.hmset( id, 'fullUrl', req.body.url );

    res.redirect("/");
  });
});
//
module.exports = ROUTER;
