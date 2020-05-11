'use strict'

const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const config = require('./config')

const app = express()

var http_server

if (config.ssl !== null) {
        http_server = https.createServer({
                key: fs.readFileSync(config.ssl.key),
                cert: fs.readFileSync(config.ssl.cert)
        }, app)
} else {
        http_server = http.createServer(app)
}

const wss = require('express-ws')(app, http_server)

const states = {}

app.use(express.json())

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.htm')
})

app.post('/change', (req, res) => {
	if (req.body.hasOwnProperty('name') && req.body.hasOwnProperty('enabled') && typeof req.body.name === 'string' && typeof req.body.enabled === 'boolean') {
		states[req.body.name] = req.body.enabled

		wss.getWss().clients.forEach(c => {
			c.send(JSON.stringify({
				name: req.body.name,
				enabled: req.body.enabled
			}))
		})
	} else {
		res.status(400)
	}
	
	res.end()
})

app.ws('/stream', function(ws, req) {
	ws.on('message', msg => {
		var response

		if (states.hasOwnProperty(msg)) {
			response = {
				name: msg,
				enabled: states[msg]
			}
		} else {
			response = null
		}

		ws.send(JSON.stringify(response))
	})
})

http_server.listen(config.bind.port, config.bind.ip, () => {
	console.log('server listening')
})

