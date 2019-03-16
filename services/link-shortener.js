const redis = require('redis');
const client = redis.createClient();

const LS = {
  getExternalWebsite(id, res){
    client.hgetall(id, (err, object) => {
      let newCount = (Number( object.viewCount ) + 1).toString();
      client.hset(id, 'viewCount', newCount);

      res.redirect( object.fullUrl );
    });
  },
  getAll(res){
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
  },
  createURL(hashName, url){
    client.lrange(hashName, 0, -1, function(err, reply) {
      let id = reply.length.toString();

      client.lpush([hashName, id]);
      client.hmset( id, 'fullUrl', url,
                        'viewCount', '0' );
    });
  },
  deleteAllTemp(){
    // delete list
    client.del("hashIds")

    //delete hashes
    for(var i = 0; i < 50; i++) {
      var delKey = i.toString()
      client.del(delKey, function(err, response) {
        if (response == 1) {
          console.log("Deleted Successfully!");
        } else{
          console.log("Cannot delete");
        }
      })
    }
  }//
};

module.exports = LS;
