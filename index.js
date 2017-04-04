var linkShortener = require('./lib/linkShortener');

// step 1: create a  link-shorter module
// this module should take in a link that the user provides and respond with a "different" link
// also, we should store the provided link in a redis store
// we'll need to be able to retrieve this link from the store at some point in the future

var str = 'www.google.com1';







linkShortener.checkUrl(str)
.then(function onFulfilled(exists) {
  console.log(`exists is ${ exists }`);
  //if false
  if (exists) {
    //return the already shortened url
    linkShortener.get(str, function(data){
    console.log("The  shortened URL is: "+ data);
    });
  } else {
    linkShortener.set(str);
  }
  
});




// linkShortener.get(str, function(data){
//   console.log("The shortened URL is: "+ data)
// })