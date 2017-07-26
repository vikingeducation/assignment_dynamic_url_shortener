const socketio = require('socket.io');
const shortener = require('../shortener');
const validUri = require('validate.io-uri');

function init(server) {
  const io = socketio(server);
  // socket stuff
  io.on('connection', client => {
    client.on('click', id => {
      shortener
        .update(id)
        .then(urlObj => {
          io.emit('update', urlObj);
        })
        .catch(err => console.error(err.stack));
    });

    client.on('shorten', url => {
      if (validUri(url)) {
        shortener
          .shorten(url)
          .then(urlObj => {
            io.emit('new', urlObj);
          })
          .catch(err => console.error(err.stack));
      } else {
        io.emit('invalid');
      }
    });
  });
  return io;
}

module.exports = init;
