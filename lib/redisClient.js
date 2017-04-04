const redis = require('redis');
var redisClient = (process.env.REDIS_URL) ? redis.createClient(process.env.REDIS_URL) : redis.createClient();

module.exports = redisClient;