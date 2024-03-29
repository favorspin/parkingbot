'use strict'

const bot = require('../bot')

const handler = (payload, res) => {
    let requester_id = payload.user_id

    let attachments = [{
        title: 'ParkingBot can help you move the car that\'s blocking you in!',
        color: '#2FA44F',
        text: '`/parking add <PLATE>` will register your license plate so that moves can be requested. \
               \n`/parking move <PLATE>` requests the owner of the car to move so you can get out. \
               \n`/parking list` will list all license plates attached to your user.',
        mrkdwn_in: ['text']
    }]

    let msg = {
        channel: payload.channel_id,
        attachments: attachments,
        text: '',
        user: requester_id
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^help\b/ig, handler: handler }