'use strict'

const http = require('http')
const express = require('express')
const config = require('./config')

const app = express()

const httpServer = http.createServer(app)
const websocketServer = require('express-ws')(app, httpServer)

const states = {}

app.use(express.json())

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.htm')
})

app.post('/change', (req, res) => {
	if (req.body.hasOwnProperty('name') && req.body.hasOwnProperty('enabled') && typeof req.body.name === 'string' && typeof req.body.enabled === 'boolean') {
		const reset = req.body.reset && typeof req.body.reset === 'boolean' && req.body.reset

		if (reset) {
			for (const key of Object.keys(states)) {
				states[key] = false
			}
		}

		states[req.body.name] = req.body.enabled
		
		websocketServer.getWss().clients.forEach(c => {
			c.send(JSON.stringify({
				name: req.body.name,
				enabled: req.body.enabled,
				reset: reset,
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
				enabled: states[msg],
				reset: false,
			}
		} else {
			response = null
		}

		ws.send(JSON.stringify(response))
	})
})

httpServer.listen(config.bind.port, config.bind.ip)

