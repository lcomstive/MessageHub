const fs = require('fs'),
	  https = require('https'),
	  express = require('express'),
	  { MessageHub, PlatformDiscord, PlatformMessenger } = require('../')

const port = 443,
	  sslKeyPath = '',
	  sslCertPath = ''

const messageHub = new MessageHub([
	new PlatformMessenger({
		token: '',
		verificationToken: ''
	}),
	new PlatformDiscord({
		token: '',
		clientID: ''
	})
]).on('message', (msg) => { msg.reply(`Echo: ${msg.text}`) })

const app = express()
app.use('/platforms', messageHub.router)

https.createServer({
	key: fs.readFileSync(sslKeyPath),
	cert: fs.readFileSync(sslCertPath)
}, app).listen(port, () => console.log(`Listening on port ${port}`))
