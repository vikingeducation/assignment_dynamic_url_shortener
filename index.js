var linkShortener = require('./lib/linkShortener');

var str = 'www.google.com123456';

linkShortener.checkUrl(str)
.then((exists) => {
  if (!exists) linkShortener.set(str);
  return linkShortener.get(str);
}).then((shortUrl) => {
  // this is our shortURL
  console.log(shortUrl);
})
