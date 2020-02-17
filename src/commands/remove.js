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
    let response_text = ''
    let plate = p[1] || ''
    let team_id = payload.team_id
    plate = plate.toUpperCase()
    let result = ''

    if (p.length != 2) {
        response_text = 'That\'s not a vaild command. Please use the `/parkingbot remove <license plate>` format!'
    } else {
        let removed = await query.removeCar(plate, team_id)
        if (removed) {
            result = ' has been removed!'
        } else {
            result = ' could not be found!'
        }
        response_text = plate + result
    }

    let msg = _.defaults({
        channel: payload.channel_name,
        text: response_text
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /(^remove|^delete)\b/ig, handler: handler }