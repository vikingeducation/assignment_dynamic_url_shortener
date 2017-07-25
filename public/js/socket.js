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

socket.on("newId", (data) => {
	addTableData(data);
})

socket.on("inputError", () => {
	alert('Invalid Input!!! :(')
})

function addTableData(data) {
	$("tbody").append(
	  $(`<tr>
	    <td><a href=${data.urlLong}>${data.urlLong}</a></td>
	    <td><a href=${data.urlShort}>${data.urlShort}</a></td>
	    <td>0</td>
	  </tr>`))
}


