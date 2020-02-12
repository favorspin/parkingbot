'use strict'

const _ = require('lodash')
const config = require('../config')
const query = require('../db/query')

const msgDefaults = {
    response_type: 'in_channel',
    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI')
}

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let attachments = []

    if (p.length != 2) {
        attachments = [{
            text: 'That\'s not a vaild license plate. Please use the `/parkingbot move <licence>` format!'
        }]
    } else {
        const plate = p[1].toUpperCase()

        let username = await query.getUsernameByPlate(plate)

        if (username == '') {
            attachments = [{
                text: 'License plate was not found.'
            }]
        } else {
            attachments = [{
                text: username + ', move your car!'
            }]
        }

    }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /^move/ig, handler: handler }