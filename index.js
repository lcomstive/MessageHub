'use strict'
const Express = require('express')
const HubMessage = require('./hub-message')
const PlatformBase = require('./platforms/platform-base')
const PlatformDiscord = require('./platforms/discord')
const PlatformMessenger = require('./platforms/messenger')
const BodyParser = require('body-parser')

module.exports =
{
	MessageHub: class MessageHub
	{
		// platforms : PlatformBase[] - Array of platforms to add to the hub
		constructor(platforms = [])
		{
			this.router = new Express.Router()
			this.router.use(BodyParser.json())
			this.router.use(BodyParser.urlencoded({ extended: true }))

			this._platforms = platforms || []
			this._callbacks = new Map()

			this._platforms.forEach(platform => this.addPlatform(platform))
		}

		addPlatform(platform)
		{
			if(!platform || !platform.name || !platform.router)
				return
			this._platforms.push(this._initializePlatform(platform))
		}

		getPlatform(name)
		{
			name = name.toLowerCase()
			for(let i = 0; i < this._platforms.length; i++)
				if(this._platforms[i].name.toLowerCase() == name)
					return this._platforms[i]
			return undefined
		}

		send(platformName, receiverID, text, additional = undefined) { new HubMessage(this, platformName, receiverID, '', additional).reply(text) }

		on(eventName, callback)
		{
			if(!this._callbacks.has(eventName))
				this._callbacks.set(eventName, [])
			this._callbacks.get(eventName).push(callback)
			return this
		}

		_getCallbacks(eventName) { return this._callbacks.get(eventName) }

		_initializePlatform(platform)
		{
			this.router.use(platform.router)
			platform._hub = this
			platform.on('message', (msg) =>
			{
				let callbacks = this._getCallbacks('message')
				if(callbacks)
					callbacks.forEach(callback => callback(msg))
			})
			return platform
		}
	},
	PlatformBase: PlatformBase,
	PlatformMessenger: PlatformMessenger,
	PlatformDiscord: PlatformDiscord
}
