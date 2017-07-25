'use strict';

const uniqueId = require('shortid').generate;

function shortener(longLink) {
	let uniqId = uniqueId();
	return `http://short.en/${uniqId}`;
}

module.exports = shortener;
