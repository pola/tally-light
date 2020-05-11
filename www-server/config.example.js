module.exports = {
	bind: {
		ip: '0.0.0.0',
		port: 4430
	},
	// path to certificate files for HTTPS, e.g. from Let's Encrypt)
	ssl: {
		key: '.../privkey.pem',
		cert: '.../fullchain.pem'
	},
	// don't use HTTPS
	//ssl: null
}
