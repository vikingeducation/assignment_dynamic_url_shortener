var socket = io.connect("http://localhost:3000");

$(document).ready(() => {
  $("a").click(e => {
    e.preventDefault();
    var data = $("a").attr("href");
    socket.emit("newUrl", data);
  });

  socket.on("urlAdded", urlData => {
    //make a row
    $(
      `<tr><td>${urlData.originalUrl}</td><td>${urlData.newUrl}</td><td>${urlData.clicks}</td><tr>`
    ).appendTo($(".table"));
  });
  socket.on("clicks", urlData => {
    //get the url that changed
    console.log(urlData);
  });
  $("#submit").click(e => {
    e.preventDefault();
    var data = $("#input input").val();
    socket.emit("newUrl", data);
  });
});
