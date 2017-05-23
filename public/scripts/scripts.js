const port = 3030;
const socket = io.connect(`http://localhost:${ port }`);

const $container = $('#links');

const makeTable = (links) => {
  for (var key in links) {
    let row = $('<tr></tr>').append(
      $('<td></td>', { class: 'mdl-data-table__cell--non-numeric', text: links[key] })
    ).append(
      $('<td></td>')
        .append ($('<a></a>', { href: `http://localhost:${ port }/r/` + key, text: `http://localhost:${ port }/r/` + key }))
    ).append(
      $('<td></td>', { text: 0 })
    )
    $container.append(row);
  }
}


socket.on('new link', (links) => {
  $container.html('');
  console.log(links);
  makeTable(links);
});