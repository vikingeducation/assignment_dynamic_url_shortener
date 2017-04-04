var linkShortener = require('./lib/linkShortener');

// step 1: create a  link-shorter module
// this module should take in a link that the user provides and respond with a "different" link
// also, we should store the provided link in a redis store
// we'll need to be able to retrieve this link from the store at some point in the future

var str = 'www.google.com';

linkShortener.checkUrl(str,function(data){
  console.log(data);
})

linkShortener.set(str);

linkShortener.checkUrl(str,function(data){
  console.log(data);
})

linkShortener.get(str, function(data){
  console.log("The shortened URL is: "+ data)
})