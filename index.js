const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
redisClient = require("redis").createClient();