const Express = require('express')
const HubMessage = require('../hub-message.js')

module.exports = class PlatformBase
{
	/*
	Constructor, taking in a name to have a human-readable
		way of distinguishing which platform is represented
	*/
	constructor(name)
	{
		this.name = name
		this.router = new Express.Router()
		
		this._callbacks = new Map()
		this._setupRouting()
	}

	/*
	Called once a message has been received by the platform
	senderID 	: Number
	message		: String
	additional  : object (platform-specific)
		Facebook : undefined
		Discord	 : DiscordChannel (of message origin)
	*/
	_gotMessage(senderID, message, additional = undefined)
	{
		let hubMsg = new HubMessage(this._hub, this.name, senderID, message, additional),
			callbacks = this._getCallbacks('message')
		if(callbacks)
			callbacks.forEach(callback => callback(hubMsg))
	}

	// Sends a message on the current platform
	sendMessage(hubMsg) { }

	// Used when wanting to set up addition webhooks or pages via Express
	_setupRouting(router) { }
	
	on(eventName, callback)
	{
		if(!this._callbacks.has(eventName))
			this._callbacks.set(eventName, [])
		this._callbacks.get(eventName).push(callback)
	}
	
	_getCallbacks(eventName) { return this._callbacks.get(eventName) }
}