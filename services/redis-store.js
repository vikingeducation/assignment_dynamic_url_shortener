const redis = require('redis')
const redisClient = redis.createClient()
const redisHash = "shortenedURLStest4"

const adler32 = require('adler-32')

const _formatURL = (url) => {
  let prefix = 'http://'
  let prefixSecure = 'https://'

  if (url.substr(0, prefix.length) !== prefix) {
    if (url.substr(0, prefixSecure.length) !== prefixSecure) {
      url = prefix + url
    }
  }

  return url
}

const saveLink = (originalURL) => {
  originalURL = _formatURL(originalURL)  
  let hashedURL = adler32.str(originalURL)

  return new Promise((resolve, reject) => {
    redisClient.hset(redisHash, hashedURL, originalURL, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const getLink = (hash) => {
  return new Promise((resolve, reject) => {
    redisClient.hget(redisHash, hash, (err, link) => {
      if (err) {
        reject(err)
      } else {
        resolve(link)
      }
    })
  })
}

const getAllLinks = () => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(redisHash, (err, links) => {
      if (err) {
        reject(err)
      } else {
        resolve(links)
      }
    })
  })
}

module.exports = {
  saveLink,
  getLink,
  getAllLinks
}