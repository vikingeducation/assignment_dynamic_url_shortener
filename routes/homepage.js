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
//   client.del("hashIds")
//
// for(var i = 0; i < 50; i++) {
//   var delKey = i.toString()
//   client.del(delKey, function(err, response) {
//     if (response == 1) {
//       console.log("Deleted Successfully!")
//     } else{
//       console.log("Cannot delete")
//     }
//   })
// } //

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


ROUTER.post('', (req, res) => {
  client.lrange('hashIds', 0, -1, function(err, reply) {
    var id = reply.length.toString();

    client.lpush(["hashIds", id], function(err,reply) { });
    client.hmset( id, 'fullUrl', req.body.url, 'viewCount', '0' );

    res.redirect("/");
  });
});
//
module.exports = ROUTER;
