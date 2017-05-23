// Three main paths
// '/' where it just shows stuff
// queries redis database for all registered urls
// what redis data structure to use? probably hashh
// displays them
// '/create' which registers a new url with redis
// '/r/:hash:' which accesses redis hash to find url, then redirects user to this url

// then websockets does the querying in '/'
// add websockets count separate from other things?
// 
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const redisClient = require('redis').createClient()


