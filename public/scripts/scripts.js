const port = 3030;
const socket = io.connect(`http://localhost:${ port }`);

const $container = $('#links');

const makeTable = (links, counts) => {
  for (var key in links) {
    let row = $('<tr></tr>').append(
      $('<td></td>', { class: 'mdl-data-table__cell--non-numeric', text: links[key] })
    ).append(
      $('<td></td>')
        .append ($('<a></a>', { href: `http://localhost:${ port }/r/` + key, text: `http://localhost:${ port }/r/` + key, id: key }))
    ).append(
      $('<td></td>', { text: counts[key] })
    )
    $container.append(row);
  }
}

socket.on('new link', (links, counts) => {
  $container.html('');
  makeTable(links, counts);
});

$('#links').on('click', 'a', (e) => {
  let id = e.target.id;
  socket.emit("click", id);
});