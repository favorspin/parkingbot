'use strict'

const _ = require('lodash');
const config = require('../config');

const msgDefaults = {
    response_type: 'in_channel',
    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
    var attachments = [{
        text: 'list stuff here'
    }]

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults);

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /list/ig, handler: handler }