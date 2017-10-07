$(document).ready(() => {
  var socket = io.connect('http://localhost:3000');

  $('#shorten-button').click( (e) => {
    // prevent form submission
    e.preventDefault();

    var link = $('#link-input').val();

    // validate link
    var urlRegex = /^[\w:\/\.]+\.[a-zA-z]{2,3}$/g;
    var validLink = urlRegex.test(link);

    if (validLink) {
      if (!link.startsWith('http')) {
        link = 'http://' + link;
      }

      socket.emit('get-existing-keys');
      socket.on('existing-keys', (keys) => {
        // if long link already exists
        if (keys.indexOf('long:' + link) > -1) {
          validLink = false;
        }

        if (validLink) {
          // send link for shortening
          socket.emit('shortenLink', link);
        } else {
          // submit for error flash
          $('#shorten-link-form').submit();
        }
      });
    } else {
      // submit for error flash
      $('#shorten-link-form').submit();
    }
  });

  socket.on('newLink', (html) => {
    // clear input field
    $('#link-input').val('');

    // remove no links line
    $("#no-link-tr").remove();

    // append html to table
    $('#link-table').append(html);
  });

  socket.on('increment-clicks', (id) => {
    var clickCount = $(`#${ id }`);
    var currentVal = parseInt(clickCount.text());
    clickCount.text(currentVal + 1);
  });
});

