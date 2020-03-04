'use strict'

const _ = require('lodash')
const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let requester_id = payload.user_id
    let slack_id = requester_id
    let team_id = payload.team_id
    let response_text = ''

    if (p.length != 1) {
        response_text = 'That\'s not a vaild command. Please use the `/parking listall` format!'
    } else {
        let cars = await query.getAllCars(team_id)
        if (_.isEmpty(cars)) {
            response_text = response_text + 'There are no cars assigned to any users in this slack account.'
        } else {
            if (cars.length == 1) {
                response_text = response_text + 'There is 1 car assigned in this slack account:'
            } else {
                response_text = response_text + 'There are ' + cars.length + ' cars assigned in this slack account:'
            }
            for (var i = 0; i < cars.length; i++) {
                response_text = response_text + '\n <@' + cars[i].slack_id + '> - `' + cars[i].license_plate + '`'
            }
        }
    }

    let msg = {
        channel: payload.channel_id,
        text: response_text,
        user: requester_id
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^listall\b/ig, handler: handler }