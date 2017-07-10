var redis = require('redis');
var client = redis.createClient(); //creates a new client

const randomString = function () {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


let storeUrl = (fullURL) => {

    return new Promise((resolve, reject) => {

        const randomText = randomString();

        //Check if key already exists, for now only logging to console. But maybe return a boolean Value and show message on the html page
        client.exists(fullURL, (err, reply) => {
            if (reply === 1) {
                reject("URL Already Exists");

            }
            else {
                //add to redis the new URL key
                client.hmset(fullURL, "shortUrl", `ragnar.${randomText}`, "count", 0, "fullURL", fullURL);
                client.rpush("urlList", fullURL);
                resolve("Saved to Redis");
            }
        });
    });

};

//Just get the URL object/hash from redis
let getUrlObj = (URL) => {

    return new Promise((resolve, reject) => {

        client.hgetall(URL, function (err, obj) {
            resolve(obj);
        });
    });
};

let getCount = (URL) => {
    client.hgetall(URL, function (err, obj) {
        return obj.count;
    });
};

let getAllURLs = () => {

    return new Promise((resolve, reject) => {

        client.lrange('urlList', 0, -1, function (err, reply) {

            if (err) reject(err);
            resolve(reply);
        });
    });
};

//Increment count. using hincrby, increment the integer value of a hash field by a given number
let incrCount = (URL) => {
    return new Promise((resolve, reject) => {

        client.hincrby(URL, "count", 1, (err, count) => {
            if (err) console.log(err);

            resolve(`Incremet ${URL} to ${count}`);
        });
    });
};

//Implement remove key from redis as well
let deleteURL = (URL) => {
    client.del(URL, (err, reply) => {
        if (err) throw err;

        console.log(`${URL} has been deleted from storage`);
    });
};

let deleteAll = () => {
    client.flushall((err, reply) => {
        if (err) throw err;

        if (reply) console.log("Cleared");
    });
};

module.exports = {
    storeUrl,
    getUrlObj,
    getAllURLs,
    deleteAll,
    deleteURL,
    incrCount,
};