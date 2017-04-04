let keysArray = [];
let valsArray = [];

redisClient.keys("urlshash" (err, keys) => {
  console.log(keys);
})