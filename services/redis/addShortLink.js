function addShortLink(shortURL, inputURL) {
  redisClient.setnx(shortURL, inputURL) //switched to access by shorturl key
}

module.exports = addShortLink