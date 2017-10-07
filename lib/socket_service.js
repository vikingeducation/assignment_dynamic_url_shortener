var Socket = {};

const getPartials = (hbs) => {
  var partials = hbs.getPartials();
  return partials;
};

Socket.setup = (io) => {
  const shortenLink = require('../lib/link-shortener');
  const redis = require("redis");
  const redisClient = redis.createClient();

  // send io for other modules
  Socket.io = io;

  io.on('connection', client => {
    client.on('shortenLink', (link) => {
      // validate link
      let urlRegex = /^[\w:\/\.]+\.[a-zA-z]{2,3}$/g;
      var validLink = urlRegex.test(link);

      if (validLink) {
        // create short url
        shortenLink(link).then((message) => {
          if (message == 'used') {

          } else {
            // format link for redis lookup
            if (!link.startsWith('http')) {
              link = 'http://' + link;
            }

            redisClient.hgetall('long:' + link, (err, object) => {
              var html = "<tr>" +
                            "<td>" +
                              "<a href=" + `${ link }` + ">" + `${ link.slice(7) }` + "</a>" +
                            "</td>" +
                            "<td>" +
                              "<a href=" + `${ object.short }` + " target='_blank'>" + `${ object.short }` + "</a>" +
                            "</td>" +
                            "<td id=" + object.short + "-clicks>0</td>" +
                          "</tr>";

              io.emit('newLink', html);
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
