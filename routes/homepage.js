const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const redis = require('redis');
const client = redis.createClient();

ROUTER.get('/:id', (req, res) => {
  let id = req.params.id

  client.hgetall(id, (err, object) => {
    let newCount = (Number( object.viewCount ) + 1).toString();
    client.hset(id, 'viewCount', newCount);

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
        var views;
        client.get(urlId, (err, count) => {
          console.log('!!count', count, '!!count')
          views = count
          console.log('@@views', views, '@@views')
        });

// console.log('!!views', views, '!!views')
        allUrls.push( {id: urlId, fullUrl: object.fullUrl, viewCount: object.viewCount } )
      });
    });
    res.render('partials/index', { allUrls });
  });
});


ROUTER.post('', (req, res) => {
  client.lrange('hashIds', 0, -1, function(err, reply) {
  var id = reply.length.toString();

  client.setnx(id, 0);
  client.lpush(["hashIds", id], function(err,reply) { });
  client.hmset( id, 'fullUrl', req.body.url, 'viewCount', '0' );

  // client.get(id, (err, reply2) => {
  //   console.log('hh', reply2)
  // })
  res.redirect("/");
  });



});
//
module.exports = ROUTER;
