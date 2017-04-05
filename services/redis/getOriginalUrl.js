function getOriginalUrl(shortLink) {
  var p = new Promise(function(resolve, reject) {
    redisClient.get(shortLink, (err, value) => {
      if(err) {
        reject(err)
      } else {
        resolve(value)
      }
    })
  });
  return p
}

module.exports = getOriginalUrl
