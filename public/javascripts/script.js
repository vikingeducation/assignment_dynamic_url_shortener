$(document).ready(function() {
	var socket = io.connect('http://localhost:3000');

	socket.on('new_count', urlObj => {
		console.log(urlObj);
		console.log(`New count: ${urlObj.count}`);
	});

	$('a').on('click', function(e) {
		let $target = $(e.target).parents('a');
		let shortUrl = $target.attr('id');
		let longUrl = $target.data('long');
	});
});
