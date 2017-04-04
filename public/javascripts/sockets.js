$(document).ready(function(){
  var socket = io.connect('http://localhost:3000');
  socket.on('new count', function(obj) {
    var id = '#' + obj.id;
    $(id).text(obj.clicks);
  })

  $(".shortlink").click(function() {
    socket.emit('increment', {href: $(this).attr('href')});
  })
})
