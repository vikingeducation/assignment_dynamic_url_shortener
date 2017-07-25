$(document).ready(function() {
  var socket = io.connect("http://localhost:3030");
  const template = $("a#template");

  socket.on("new_count", urlObj => {
    let anchor = $(`a#${urlObj.short}`);
    console.log(anchor);
    $(`a#${urlObj.short}`).find("span").text(urlObj.count);
  });

  $("a").on("click", function(e) {
    let $target = $(e.target).parents("a");
    let shortUrl = $target.attr("id");
    let longUrl = $target.data("long");
    e.preventDefault();
  });
});
