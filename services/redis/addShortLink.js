function addShortLink(shortURL, inputURL) {
  redisClient.hset("urlshash", shortURL, inputURL) //switched to access by shorturl key
}

module.exports = addShortLink