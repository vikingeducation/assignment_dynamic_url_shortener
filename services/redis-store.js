const redis = require('redis')
const redisClient = redis.createClient()
const redisHashedLinks = "shortenedURLsTest7"
const redisClickCounts = "clickCountsTest7"

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

const _initializeClickCount = (hash) => {
  let clickCount = "count-" + hash
  redisClient.setnx("clickCount", 0)
}

// This does the following:
// hsetnx clickCountsTest5 HASHEDURL 0
const saveClickCounts = (originalURL) => {
  originalURL = _formatURL(originalURL)  
  let hashedURL = adler32.str(originalURL)

  return new Promise((resolve, reject) => {
    redisClient.hsetnx(redisClickCounts, hashedURL, 0, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const saveLink = (originalURL) => {
  originalURL = _formatURL(originalURL)  
  let hashedURL = adler32.str(originalURL)

  return new Promise((resolve, reject) => {
    redisClient.hset(redisHashedLinks, hashedURL, originalURL, (err, data) => {
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
    redisClient.hget(redisHashedLinks, hash, (err, link) => {
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
    redisClient.hgetall(redisHashedLinks, (err, links) => {
      if (err) {
        reject(err)
      } else {
        resolve(links)
      }
    })
  })
}

const incrementClickCount = (hash) => {
  return new Promise((resolve, reject) => {
    redisClient.hincrby(redisClickCounts, hash, 1, (err, count) => {
      if (err) {
        reject(err)
      } else {
        resolve(count)
      }
    })
  })
}

const getAllClickCounts = () => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(redisClickCounts, (err, counts) => {
      if (err) {
        reject(err)
      } else {
        resolve(counts)
      }
    })
  })
}

module.exports = {
  saveLink,
  getLink,
  getAllLinks,
  incrementClickCount,
  getAllClickCounts,
  saveClickCounts
}