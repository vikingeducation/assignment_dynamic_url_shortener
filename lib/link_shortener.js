var shortid = require('shortid');

var linkShortener = (baseURL) => {
  //console.log(shortid.generate());
  let hashValue = shortid.generate();
  let shortURL = "http://www.".concat(hashValue).concat(".com");
  //console.log(shortURL);

  var urlPair = { baseURL : baseURL,
                  shortURL : shortURL
                };
}

linkShortener("www.google.com");

module.exports = linkShortener;
