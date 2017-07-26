$(manageSockets);

function manageSockets() {
  let socket = io.connect('http://localhost:3000');

  // Server Events
  socket.on('update', urlObj => {
    $(`#${urlObj.id} .count`).text(urlObj.count);
  });

  socket.on('new', urlObj => {
    let newRow = $('<tr>').attr('id', urlObj.id);
    let shortLink = $('<a>').attr('href', urlObj.url).text(urlObj.url);
    newRow.append($('<td>').append(shortLink));
    let longLink = $('<a>')
      .attr('href', urlObj.originalUrl)
      .text(urlObj.originalUrl);
    newRow.append($('<td>').append(longLink));
    newRow.append($('<td>').addClass('count').text(urlObj.count));

    $('tbody').append(newRow);
  });

  socket.on('invalid', () => {
    $('#url').val('http://');
    alert('Sorry, you entered an invalid url. Please try again.');
  });

  // Client Events
  $('#url-button').on('click', event => {
    event.preventDefault();
    socket.emit('shorten', $('#url').val());
  });
}
