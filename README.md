# MessageHub
A NodeJS library to consolidate multiple messaging platforms into one simple, event-driven API

## Contents
 - [Installation](#installation)
    - [Discord](#discord)
    - [Facebook Messenger](#facebook-messenger)
 - [Credits](#credits)

### Installation
To add *Message Hub* to a *NodeJS* project simply install from *npm*

`npm install message-hub`

Then import the hub and any platforms you require
```javascript
// import any platforms you want to use (PlatformBase is used for adding your own platform)
const { MessageHub, PlatformDiscord, PlatformMessenger, PlatformBase } = require('message-hub')
```

And finally create a message hub, add a message callback,
creates any platforms you wish to use and add the router to your express app
```javascript
let hub = new MessageHub()
hub.on('message', (msg) => { console.log('Got message "' + msg.text + '"') }) // msg being a HubMessage

hub.addPlatform(new PlatformDiscord(..options..))

// expressApp.use(optional_prepended_url, router)
expressApp.use('/platforms', hub.router)
```

#### Discord
Head to Discord's [developer portal](https://discordapp.com/developers/applications/) and create a new app, take note of the *client ID* shown on the created application.
Continue to the "*bots*" tab and press the "*add bot*" button, revealing the token and copying it to your clipboard.

When creating `PlatformDiscord` pass in the following options
```javascript
let discordOptions = {
	token: '<bot_token>',
    clientID: '<client_id>'
}

hub.addPlatform(new PlatformDiscord(discordOptions))
```

#### Facebook Messenger
On Facebook's [main site](https://www.facebook.com) create a new page

On Facebook's [developer site](https://developers.facebook.com/) create a new app and add the *Messenger product*, then go to it's settings.

![Messenger Add Product](./images/messenger_add_product.png)

In the *Messenger* settings, under *Access Tokens* select the page you created in the
above step (*you may have to 'Edit Permissions' to the right of the
'Page Access Token' field first*). The token generated is your 'page_access_token' as
referenced in the below code.


To receive messages a webhook is needed, under the *Access Tokens* section is the
*Webhooks* section, here press *'Subscribe To Events*' and set the callback URL
to your web server appended by `/platforms/facebook_messenger`
(e.g. `https://www.mytestsite.com/platforms/facebook_messenger`).

For the *Verify Token* section, this should match the 'verification_token' as
referenced in the below code.

Subscription fields required at minimum is *'messages'*.

Before saving the subscription your MessageHub server should be running,
as Facebook tests your webhook against the verification token before letting
you save.

Finally, under the `Webhooks` section you can now select a page to subscribe.


When creating `PlatformMessenger` pass in the following options
```javascript
let messengerOptions = {
	token: '<page_access_token>',
	verificationToken: '<verification_token>'
}
```

## Credits
 - [NodeJS](https://nodejs.org/)
 - [Discord.JS](https://discord.js.org/)

## License
This project is under the [MIT License](./LICENSE)
