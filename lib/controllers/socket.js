const socketio = require('socket.io');
const shortener = require('../shortener');

function init(server) {
  const io = socketio(server);
  // socket stuff
  io.on('connection', client => {
    // get counts and update client
    _updateEvereything(client);

    client.on('clickLink', id => {
      // increment link
      let updatePromise = shortener.update(id);
      // get counts and update all clients
      updatePromise.then(() => {
        _updateEvereything(io);
      });
    });

    client.on('shorten', url => {
      // shorten link
      shortener.shorten(url);
      // get counts and update all clients
      _updateEvereything(io);
    });
  });
  return io;
}

function _updateEvereything(target) {
  // get all counts
  let idArrayPromise = shortener.getAllCountsAndUrls();

  // display page
  idArrayPromise.then(([countsObject, urlsObject]) => {
    let urls = [];
    for (let id in countsObject) {
      let fqu = `http://${req.hostname}:${env.port}/${id}`;
      urls.push({
        url: fqu,
        count: countsObject[id],
        originalUrl: urlsObject[id]
      });
    }

    target.emit('update', urls);
  });
}

module.exports = init;
