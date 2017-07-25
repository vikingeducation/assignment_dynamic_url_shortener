var socket = io.connect('http://localhost:3000');

// socket.on('greeting', function(data) {
//   console.log("acknowledged?")
// })

socket.emit('event');

$(".submission").on("click", ".makeUrl", (e) => {
  e.preventDefault();
  const url = $(".urlSpecial").val();
  socket.emit("url", { name: url });
  alert('Link submitted!')
})

socket.on("newId", (data) => {

})

$("tbody").append(
  $(`<tr>
    <td><a href=${data.urlLong}>${data.urlLong}</a></td>
    <td><a href=${data.urlLong}>${data.urlShort}</a></td>
    <td>0</td>
  </tr>`))
