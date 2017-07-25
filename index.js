const app = require("express")
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const redisWrapper = require('./lib/redis_wrapper');


server.get('/', (req, res)=> {
  redisWrapper.saveLink({long: 'something.com'})
})


server.listen(3000, "0.0.0.0", (req, res) => {
 console.log("listening on port 3000");
 });
