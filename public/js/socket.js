$(document).ready(() => {
  // const socket = io.connect("http://localhost:3000");
  const socket = io.connect("https://dynamic-url-shortener.herokuapp.com");

  $(".submission").on("click", ".makeUrl", e => {
    e.preventDefault();
    const url = $(".urlSpecial").val();
    socket.emit("url", { name: url });
  });

  socket.on("newId", data => {
    if ($(`#${data.id}`).length > 0) {
      updateCount(data);
      console.log("updating");
    } else {
      addTableData(data);
    }
  });

  socket.on("inputError", () => {
    alert("Invalid Input!!! :(");
  });

  socket.on("count", data => {
    updateCount(data);
  });

  function addTableData(data) {
    $("tbody").append(
      $(`<tr id=${data.id}>
  	    <td><a href=${data.urlLong}>${data.urlLong}</a></td>
  	    <td><a href=${data.urlShort}>${data.urlShort}</a></td>
  	    <td class=${data.id}>${data.count}</td>
  	  </tr>`)
    );
  }

  function updateCount(data) {
    $(`.${data.id}`).text(data.count);
  }
});
