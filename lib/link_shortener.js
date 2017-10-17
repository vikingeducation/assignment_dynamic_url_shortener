const shortid = require("shortid");

module.exports = {
	linkShortener: () => {
		return shortid.generate();
	}
}
