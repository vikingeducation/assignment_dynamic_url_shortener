var shortid = require('shortid');

var linkShortener = (baseURL) => {
  let hashValue = shortid.generate();
  let shortURL = "http://www.".concat(hashValue).concat(".com");

  var urlPair = { 
    baseURL : baseURL,
    shortURL : shortURL
  };
}


module.exports = linkShortener;
