var socket = io.connect("http://localhost:3000");

$(document).ready(() => {
  socket.emit("load");

  socket.on("urlAdded", urlData => {
    socket.emit("load");
  });

  socket.on("dataUrls", data => {
    $(".table tbody").children().remove();
    data[0].forEach((el, idx) => {
      $(
        `<tr><td>${data[0][idx]}</td><td><a href=${data[1][idx]}>${data[1][
          idx
        ]}</a></td><td>${data[2][idx]}</td><tr>`
      ).appendTo($(".table"));
    });
  });

  socket.on("clicks", () => {
    socket.emit("load");
  });

  $("#submit").click(e => {
    var urlStart = "";
    var s = $("#input input").val();
    urlStart = urlStart.concat(s[0], s[1], s[2], s[3], s[4], s[5], s[6]);
    if (urlStart === "http://" || urlStart === "https:/") {
      e.preventDefault();
      var data = $("#input input").val();
      socket.emit("newUrl", data);
    } else {
      alert("Invalid URL!");
    }
  });
});
