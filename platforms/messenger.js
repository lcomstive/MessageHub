const request = require('request')
const PlatformBase = require('./platform-base')

module.exports = class PlatformMessenger extends PlatformBase
{
	/*
	 options
		token 			  : string - Facebook app token
		verificationToken : string - Token used to verify the webhook
		debug			  : bool   - Display verbose information
	*/
	constructor(options)
	{
		super('facebook_messenger')
		this._options = options

		if(!this._options.token || this._options.token.length == 0)
		{
			console.log('[MSG_HUB][MESSENGER] Platform \'facebook messenger\' requires a messenger token')
			return
		}
		if(!this._options.verificationToken || this._options.verificationToken.length == 0)
		{
			console.log('[MSG_HUB][MESSENGER] Platform \'facebook messenger\' requires a verification token')
			return
		}

		if(this._options.debug)
			console.log('[MSG_HUB][MESSENGER] Facebook Messenger ready')
	}

	sendMessage(hubMsg)
	{
		if(this._options.debug)
			console.log(`[MSG_HUB][MESSENGER] Sending facebook message to '${hubMsg.user}' - '${hubMsg.text}'`)
		request({
			url: 'https://graph.facebook.com/v2.6/me/messages',
			qs: { access_token: this._options.token },
			method: 'POST',
			json: {
				recipient: { id: hubMsg.user },
				message: { text: hubMsg.text }
			}
		}, (err, res, body) => { if(err) console.log(`[MSG_HUB][MESSENGER] Unable to send facebook message: ${err}`) })
	}

	_setupRouting()
	{
		if(!this.router)
			return
		console.log('FB Router found')
		this.router.route('/facebook_messenger')
			.get((req, res) =>
			{
				console.log(`Got GET`)

				let mode = req.query['hub.mode'],
					token = req.query['hub.verify_token'],
					challenge = req.query['hub.challenge']

				if(mode && token)
				{
					if(mode == 'subscribe' && token == this._options.verificationToken)
					{
						if(this._options.debug)
							console.log('[MSG_HUB][MESSENGER] Facebook Messenger webhook verified')
						res.status(200).send(challenge)
					}
					else
						res.sendStatus(403)
				}
				else
					res.sendStatus(403)
			})
			.post((req, res) =>
			{
				console.log(`Got POST`)
				if(!req.body || req.body.object != 'page')
				{
					res.sendStatus(403)
					return
				}

				req.body.entry.forEach((entry) =>
				{
					let webhookEvent = entry.messaging[0]
					let senderID = webhookEvent.sender.id

					if(webhookEvent.message)
					{
						if(this._options.debug)
							console.log(`[MSG_HUB][MESSENGER] Got message from '${senderID}' - '${webhookEvent.message.text}`)
						this._gotMessage(senderID, webhookEvent.message.text)
					}
				})
				res.status(200).send('EVENT_RECEIVED')
			})
	}
}
