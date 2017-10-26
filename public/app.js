var socket = io.connect('http://localhost:4000');
console.log(socket)
socket.on('increment count', (url, count) => {
  console.log("url", url)
  var urlID = '#'.concat(url);
  console.log("count", count)
  console.log("urlId:", urlID);
  $(urlID).text(count);
});
socket.on('addnewlink', (url, shorturl) => {
  console.log(url, shorturl)
  $('.table > tbody:last-child').append(`<tr> <td> ${url} </td> <td> ${shorturl}</td><td id=${url}> 0 </td></tr>`);

})
