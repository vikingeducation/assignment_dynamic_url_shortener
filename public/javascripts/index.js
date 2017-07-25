var socket = io.connect("http://localhost:3000");

$(document).ready(() => {
  $("h1").click(() => {
    var data = $("h1").html();
    socket.emit("newUrl", data);
  });
  $("a").click(e => {
    e.preventDefault();
    var data = $("a").attr("href");
    socket.emit("newUrl", data);
  });
});
