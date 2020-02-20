'use strict'

const config = require('../config')

const msgDefaults = {
    response_type: 'in_channel',
    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {

    let requester_id = payload.user_id

    let attachments = [{
        title: 'Parkingbot can help you move the car that\'s blocking you in!',
        color: '#2FA44F',
        text: '`/parking add <LICENSE>` will register your license plate so that moves can be requested. \
               \n`/parking move <LICENSE>` requests the owner of the car to move so you can get out. \
               \n`/parking list` will list all Licnese plates attached to your user.',
        mrkdwn_in: ['text']
    }]

    let msg = {
        channel: payload.channel_name,
        user: requester_id,
        attachments: attachments
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^help\b/ig, handler: handler }