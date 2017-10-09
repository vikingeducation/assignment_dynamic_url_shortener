const redis = require("redis");
const client = redis.createClient();
const randomstring = require('randomstring');

const generateRandomString = () => {
  return randomstring.generate({
    length: 8,
    charset: 'alphanumeric'
  });
};

const createShortLink = () => {
  return new Promise((resolve, reject) => {
    var string = generateRandomString();

    client.sismember('shorts', string, (err, used) => {
      if (used) {
        createShortLink()
        .then((url) => {
          resolve(url);
        });
      } else {
        client.sadd('shorts', string);
        resolve(string);
      }
    });
  });
};

const formatForWebSurfing = (link) => {
  link = link.trim().split(' ').join('-');

  if (!link.startsWith('http')) {
    link = 'http://' + link;
  }

  return link;
};

const shortenLink = (link) => {
  return new Promise((resolve, reject) => {
    longLink = formatForWebSurfing(link);

    var shortExists = false;

    client.keys('long:*', async (err, keys) => {
      if (keys.length == 0) {
        var shortLink = await createShortLink();
        await client.hmset("long:" + longLink, 'short', shortLink, 'clicks', '0');
        resolve();
      } else if (keys.indexOf('long:' + longLink) > -1) {
        resolve('used');
      } else {
        var shortLink = await createShortLink();

        keys.forEach( (key) => {
          client.hget(key, 'short', async (err, short) => {
            if (shortLink == short) {
              shortExists = true;
            }

            if (key == keys[keys.length - 1]) {

              if (!shortExists) {
                client.hmset("long:" + longLink, 'short', shortLink, 'clicks', '0');
                resolve();
              }
            }
          });
        });
      }
    });
  });
};

module.exports = shortenLink;
