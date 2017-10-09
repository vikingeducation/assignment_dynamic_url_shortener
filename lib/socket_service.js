var Socket = {};

const getPartials = (hbs) => {
  var partials = hbs.getPartials();
  return partials;
};

Socket.setup = (io) => {
  const shortenLink = require('../lib/link-shortener');
  const redis = require("redis");
  const redisClient = redis.createClient();
  const app = require('../app');
  const hbs = app.get('Handlebars');
  const partials = hbs.getPartials();

  // send io for other modules
  Socket.io = io;

  io.on('connection', client => {
    client.on('shortenLink', (link) => {
      // validate link
      let urlRegex = /^[\w:\/\.]+\.[a-zA-z]{2,3}$/g;
      var validLink = urlRegex.test(link);

      if (validLink) {
        // create short url
        shortenLink(link).then(async (message) => {
          const app = require('../app');
          const hbs = app.get('Handlebars');

          if (message == 'used') {
            client.emit('error_message', 'That link is already used.');
          } else {
            // format link for redis lookup
            if (!link.startsWith('http')) {
              link = 'http://' + link;
            }

            redisClient.hgetall('long:' + link, async (err, object) => {
              var partial = await hbs.render(
                'views/partials/link_row.hbs',
                { short: object.short, clicks: 0 },
                { data: { key: link } }
              );

              io.emit('newLink', partial);
            });
          }
        });
      }
    });

    client.on('get-existing-keys', () => {
      redisClient.keys('long:*', (err, keys) => {
        client.emit('existing-keys', keys);
      });
    });
  });
};

module.exports = Socket;
