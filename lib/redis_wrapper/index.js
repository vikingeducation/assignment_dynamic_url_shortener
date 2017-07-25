const redisClient = require('redis').createClient();

function saveLink(linkObject){
  // linkObject should contain the shortened url and original url
  // originalURL
  // shortenedURL
  let {short, long} = linkObject
  if (short && long){
    redisClient.set(long, short);
    return true
  } else {
    console.error('missing params')
    return false
  }
}

function loadLink(originalURL){
  return redisClient.getAsync(originalURL);
}


module.exports = {
  saveLink: saveLink,
  loadLink: loadLink
}
