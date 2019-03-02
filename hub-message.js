module.exports = class HubMessage
{
	/*
	 HubMessage(
	 	hub				: MessageHub - The hub instantiating this message
	 	platformName	: string 	 - Name of platform sending or receiving the message,
		userID			: int	 	 - ID of the message sender, or undefined if sending,
		messageContents : string 	 - Textual content of message,
		additional		: object 	 - Optional parameter based on platform (e.g. Discord Channel)
	 )
	*/
	constructor(messageHub, platformName, userID, messageContents, additional = undefined)
	{
		this.hub = messageHub
		this.platform = platformName
		this.user = userID
		this.message = messageContents
		this.additional = additional
	}
	
	reply(text)
	{
		let platform = this.hub.getPlatform(this.platform)
		if(!platform)
		{
			console.log(`[MSG_HUB][ERROR] Cannot find platform \'${this.platform}\'`)
			return
		}
		this.message = text
		platform.sendMessage(this)
	}
}