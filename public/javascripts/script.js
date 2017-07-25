$(document).ready(function() {
	var socket = io.connect('http://localhost:3000');
	const $template = $('a#template');

	socket.on('new_count', urlObj => {
		$(`a#${urlObj.short}`).find('span').text(urlObj.count);
	});

	socket.on('new_create', urlObj => {
		let $newRow = $template.clone();
		$newRow.attr('href', urlObj.short);
		$newRow.attr('id', urlObj.short);
		$newRow.data('long', urlObj.long);
		$newRow.find('div.panel-heading').text(urlObj.short);
		$newRow.find('div.panel-body').text(urlObj.long);
		$newRow.appendTo('div#row-container').removeClass('hidden');
	});

	socket.on('new_delete', shortUrl => {
		$(`a#${shortUrl}`).remove();
	});

	$('a').on('click', function(e) {
		let $target = $(e.target).parents('a');
		let shortUrl = $target.attr('id');
		let longUrl = $target.data('long');
	});

	$('form').on('submit', function(e) {
		let $target = $(e.target);
		let urlToShorten = $('input#originalURL').val();
		if (!/^http:\/\//i.test(urlToShorten)) {
			urlToShorten = 'http://' + urlToShorten;
		}
		socket.emit('create', urlToShorten);
		e.preventDefault();
	});

	$('a button').on('click', function(e) {
		let $target = $(e.target);
		let $anchor = $target.parents('a');
		let shortUrl = $anchor.attr('id');
		let longUrl = $anchor.data('long');

		socket.emit('delete', {
			short: shortUrl,
			long: longUrl
		});

		e.preventDefault();
		e.stopPropagation();
	});
});
