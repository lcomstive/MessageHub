const Discord = require('discord.js')
const PlatformBase = require('./platform-base')

module.exports = class PlatformDiscord extends PlatformBase
{
	/*
	 options
		token	 : string - Discord Bot token
		clientID : string - Optional ID of the client, used to generate invite link
		debug	 : bool   - Show extra verbose information
	*/
	constructor(options)
	{
		super('discord')

		this._options = options
		this._options.token = this._options.token || ''
		this._options.debug = this._options.debug || false
		this._options.clientID = this._options.clientID || '<client_id>'

		if(!this._options.token || this._options.token.length == 0)
			return

		this._client = new Discord.Client()
		this._client.on('ready', () =>
		{
			if(this._options.debug)
				console.log(`[MSG_HUB][DISCORD] Discord ready\n\tAdd via https://discordapp.com/oauth2/authorize?client_id=${this._options.clientID}&scope=bot`)

			let callbacks = this._getCallbacks('ready')
			if(callbacks)
				callbacks.forEach(callback => callback(hubMsg))

		})
		this._client.on('message', (msg) => this._handleMessage(msg))
		this._client.login(this._options.token)
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
		if(!hubMsg.text || !(hubMsg.additional && hubMsg.additional instanceof Discord.Channel))
		{
			console.log(`[MSG_HUB][DISCORD] Insufficient information to send Discord message`)
			return
		}
		if(this._options.debug)
			console.log(`[MSG_HUB][DISCORD] Sending discord message to '${hubMsg.user}' - '${hubMsg.text}'`)
		hubMsg.additional.send(hubMsg.text)
	}
}
