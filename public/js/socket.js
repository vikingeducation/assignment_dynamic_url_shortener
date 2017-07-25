var socket = io.connect('http://localhost:3000');

// socket.on('greeting', function(data) {
//   console.log("acknowledged?")
// })

socket.emit('event');

$(".submission").on("click", ".makeUrl", (e) => {
  e.preventDefault();
  const url = $(".urlSpecial").val();
  socket.emit("url", { name: url });
})
