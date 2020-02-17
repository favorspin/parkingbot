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
    let slack_id = payload.user_id
    let team_id = payload.team_id
    let response_text = ''

    if (p.length < 1 || p.length > 2) {
        response_text = 'That\'s not a vaild command. Please use the `/parking list` format!'
    } else {
        if (p.length == 2) {
            slack_id = p[1].match(/@.*\|/).toString().replace(/(@|\|)/g,'')
        }
        let cars = await query.getAllCarsForUser(slack_id, team_id)
        if (_.isEmpty(cars)) {
            response_text = 'There are no cars `ed to <@' + slack_id + '>'
        } else {
            if (cars.length == 1) {
                response_text = 'There is 1 car attached to <@' + slack_id + '>:'
            } else {
                response_text = 'There are ' + cars.length + ' cars attached to <@' + slack_id + '>:'
            }
            for (var i = 0; i < cars.length; i++) {
                response_text = response_text + '\n `' + cars[i].license_plate + '`'
            }
        }
    }

    let msg = _.defaults({
        channel: payload.channel_name,
        text: response_text
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /^list\b/ig, handler: handler }