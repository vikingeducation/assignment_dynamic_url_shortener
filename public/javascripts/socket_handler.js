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
      // send link for shortening
      socket.emit('shortenLink', link);
    } else {
      // submit for error flash
      $('#link-input').val('');
      addFlashError('Invalid link. Please try again.');
    }
  });

  socket.on('newLink', (partial) => {
    // clear input field
    $('#link-input').val('');

    // remove no links line
    $("#no-link-tr").remove();

    // append html to table
    $('#link-table').append(partial);
    $('.alert').remove();
  });

  socket.on('increment-clicks', (id) => {
    var clickCount = $(`#${ id }`);
    var currentVal = parseInt(clickCount.text());
    clickCount.text(currentVal + 1);
  });

  socket.on('error_message', error => {
    addFlashError(error);
  });
});

const addFlashError = error => {
  $('.alert').remove();
  $('#flash').append('<div class="alert alert-danger alert-dismissible text-center" role="alert" style="border-radius: 0;"></div>');
  $('.alert').append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button');
  $('.alert').append(error);
};

