'use strict'

const _ = require('lodash');
const config = require('../config');

const msgDefaults = {
    response_type: 'in_channel',
    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {

    console.log(payload);

    var attachments = [{
        text: 'move stuff here'
    }]

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults);

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /move/ig, handler: handler }