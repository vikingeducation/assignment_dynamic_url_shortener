var redis = require('redis');
var client = redis.createClient(); //creates a new client

const randomString = function () {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const linkShortner = {

    storeUrl: (fullURL) => {
        const randomText = randomString();

        //Check if key already exists, for now only logging to console. But maybe return a boolean Value and show message on the html page
        client.exists(fullURL, (err, reply) => {
            if (reply === 1) {
                console.log("URL Already Exists!!");
            }
            else {
                //add to redis the new URL key
                client.hmset(fullURL, "shortUrl", `ragnar/${randomText}`, "count", 0);
            }
        });

    },

    //Just get the URL object/hash from redis
    getUrlObj: (URL) => {
        client.hgetall(URL, function (err, obj) {
            console.log(obj);
        });
    },

    getCount: (URL) => {
        client.hgetall(URL, function (err, obj) {
            console.log(obj.count);
        });
    },

    //Increment count. using hincrby, increment the integer value of a hash field by a given number
    incrCount: (URL) => {
        client.hincrby(URL, "count", 1, (err, count) => {
            if (err) console.log(err);
        });

    },

    //Implement remove key from redis as well
    deleteURL: (URL) => {
        client.del(URL, (err, reply) => {
            if(err) throw err;

            console.log(`${URL} has been deleted from storage`);
        });
    },

    deleteAll: () => {
      client.flushall( (err, reply) => {
        if(err) throw err;

        if(reply) console.log("Cleared");
      });  
    }
}
module.exports = linkShortner;