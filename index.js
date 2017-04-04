var linkShortener = require('./lib/linkShortener');

var str1 = 'www.facebook.com';
var str2 = 'www.nytimes.com';
var str3 = 'www.cnn.com';

linkShortener.get(str1).then((data) => {
  console.log(`${str1}: ${data}`);
})
linkShortener.get(str2).then((data) => {
  console.log(`${str2}: ${data}`);
})
linkShortener.get(str3).then((data) => {
  console.log(`${str3}: ${data}`);
})