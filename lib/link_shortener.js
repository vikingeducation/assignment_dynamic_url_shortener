var shortid = require('shortid');

var linkShortener = (inputURL) => {
  let hashValue = shortid.generate();
  let shortURL = "http://www.".concat(hashValue).concat(".com");

  var urlObject = {
    inputURL : inputURL,
    shortURL : shortURL
  };
  console.log(urlObject)
  return urlObject;
}


module.exports = linkShortener;
