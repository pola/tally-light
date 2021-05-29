'use strict'

const http = require('http')
const express = require('express')
const config = require('./config')

const app = express()

const httpServer = http.createServer(app)
const websocketServer = require('express-ws')(app, httpServer)

let enabled = []

app.use(express.json())

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.htm')
})

app.put('/change', (req, res) => {
	if (!Object.prototype.hasOwnProperty.call(req.body, 'enabled') || !Array.isArray(req.body.enabled) || req.body.enabled.map(x => typeof x).filter(x => x !== 'string').length > 0) {
		res.status(400).end()
		return
	}

	enabled = req.body.enabled.filter((v, i, a) => a.indexOf(v) === i)
	
	websocketServer.getWss().clients.forEach(c => {
		c.send(JSON.stringify(enabled))
	})
	
	res.end()
})

app.ws('/stream', function(ws, req) {
	ws.on('message', () => {
		ws.send(JSON.stringify(enabled))
	})
})

httpServer.listen(config.bind.port, config.bind.ip)

