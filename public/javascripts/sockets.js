$(document).ready(function(){
  var currentUrl = $(location).attr('href')
  var socket = io.connect(currentUrl);
  socket.on('new count', function(obj) {
    var id = '#' + obj.id;
    $(id).text(obj.clicks);
  })
  $(".shortlink").click(function() {
    socket.emit('increment', {href: $(this).attr('href')});
  })
})
