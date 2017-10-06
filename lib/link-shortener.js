const redis = require("redis");
const client = redis.createClient();
const randomstring = require('randomstring');

const generateRandomString = () => {
  return randomstring.generate({
    length: 8,
    charset: 'alphanumeric'
  });
};

const createShortLink = async () => {
  var string = generateRandomString();

  await client.sismember('shorts', string, (err, used) => {
    if (used) {
      createShortLink();
    } else {
      client.sadd('shorts', string);
    }
  });

  return string;
};

const formatForWebSurfing = (link) => {
  link = link.trim().split(' ').join('-');

  if (!link.startsWith('http')) {
    link = 'http://' + link;
  }

  return link;
};

const shortenLink = async (link) => {
  link = formatForWebSurfing(link);

  var longExists = false;

  await client.keys('short:*', async (err, keys) => {
    if (keys.length == 0) {
      var shortLink = await createShortLink();
      client.hmset("short:" + shortLink, 'long', link, 'clicks', '0');
    } else {
      keys.forEach( async (key) => {
        await client.hget(key, 'long', async (err, longLink) => {
          if (longLink == link) {
            longExists = true;
          }

          if (key == keys[keys.length - 1]) {
            var shortLink = await createShortLink();

            if (!longExists) {
              client.hmset("short:" + shortLink, 'long', link, 'clicks', '0');
            }
          }
        });
      });
    }
  });
};

module.exports = shortenLink;
