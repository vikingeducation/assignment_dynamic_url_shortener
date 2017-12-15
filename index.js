const app = require('express')()
const redis = require('redis')
const redisClient = redis.createClient()

app.get('/', (req, res) => {
redisClient.incr('visitor-count', (err, count) => {
  res.send(`Visitor Count: ${count}, list: ${}`)
})
})

app.get('/pos', (req, res) => {
redisClient.geopos('Dublin Ireland', (err, count) => {
  res.send(`list: ${count}`)
})
})

app.listen(3000)
