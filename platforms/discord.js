const Discord = require('discord.js')
const PlatformBase = require('./platform-base')

module.exports = class PlatformDiscord extends PlatformBase
{
	constructor(options)
	{
		super('discord')

		this._config = options

		this._config.token = this._config.token || ''
		this._config.clientID = this._config.clientID || '<client_id>'

		if(!this._config.token || this._config.token.length == 0)
			return

		this._client = new Discord.Client()
		this._client.on('ready', () =>
		{
			if(this._config.debug)
				console.log(`[MSG_HUB][DISCORD] Discord ready\n\tAdd via https://discordapp.com/oauth2/authorize?client_id=${this._config.clientID}&scope=bot`)
			
			let callbacks = this._getCallbacks('ready')
			if(callbacks)
				callbacks.forEach(callback => callback(hubMsg))

		})
		this._client.on('message', (msg) => this._handleMessage(msg))
		this._client.login(this._config.token)
	}

	_handleMessage(discordMessage)
	{
		if(discordMessage.author.id == this._client.user.id)
			return // don't respond to own messages
		// Send message to PlatformBase
		this._gotMessage(discordMessage.author.id, discordMessage.cleanContent, discordMessage.channel)
	}

	// additional should be a DiscordChannel
	sendMessage(hubMsg) // receiverID, messageText, channel = undefined)
	{
		if(!hubMsg.message || !(hubMsg.additional && hubMsg.additional instanceof Discord.Channel))
		{
			console.log(`[MSG_HUB][DISCORD] Insufficient information to send Discord message`)
			return
		}
		hubMsg.additional.send(hubMsg.message)
	}
}
