$(document).ready(function() {
  var socket = io.connect("http://localhost:3000");

  socket.on("new_count", countObj => {
    console.log(countObj);
  });

  // $("a").on("click", function(e) {
  //   let $target = $(e.target);
  //   let id = $target.attr("id");
  //   socket.emit("increment", id);
  // });
});
