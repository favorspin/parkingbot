'use strict'

const _ = require('lodash')
const config = require('../config')
const bot = require('../bot')

// const msgDefaults = {
//     response_type: 'ephemeral',
//     username: 'ParkingBot',
//     icon_emoji: config('ICON_EMOJI')
// }

const handler = (payload, res) => {
    let requester_id = payload.user_id

    let attachments = [{
        title: 'ParkingBot can help you move the car that\'s blocking you in!',
        color: '#2FA44F',
        text: '`/parking add <LICENSE>` will register your license plate so that moves can be requested. \
               \n`/parking move <LICENSE>` requests the owner of the car to move so you can get out. \
               \n`/parking list` will list all Licnese plates attached to your user.',
        mrkdwn_in: ['text']
    }]

    // let msg = _.defaults({
    //     channel: payload.channel_name,
    //     attachments: attachments,
    //     text: ''
    // }, msgDefaults)

    let msg = {
        channel: payload.channel_name,
        attachments: attachments,
        user: requester_id,
        text: ''
    }

    bot.postEphemeral(msg)
    res.status(200).end()

    // res.set('content-type', 'application/json')
    // res.status(200).json(msg)
    return
}

module.exports = { pattern: /^help\b/ig, handler: handler }