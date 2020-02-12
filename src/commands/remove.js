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
    let plate = p[1] || ''
    plate = plate.toUpperCase()
    let result = ''

    if (p.length != 2) {
        attachments = [{
            text: 'That\'s not a vaild command. Please use the `/parkingbot remove <license plate>` format!'
        }]
    } else {
        let removed = await query.removeCar(plate)
        if (removed) {
            result = ' has been removed!'
        } else {
            result = ' could not be found!'
        }
        attachments = [{
            text: plate + result
        }]
    }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /(^remove|^delete)/ig, handler: handler }