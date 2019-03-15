const redis = require('redis');
const client = redis.createClient();

const LS = {
  createURL(hashName, url){
    client.lrange(hashName, 0, -1, function(err, reply) {
      let id = reply.length.toString();

      client.lpush([hashName, id]);
      client.hmset( id, 'fullUrl', url,
                        'viewCount', '0' );
    });
  },
  deleteAll(){
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
