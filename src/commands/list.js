'use strict'

const _ = require('lodash')
const config = require('../config')
const query = require('../db/query')
const bot = require('../bot')

const msgDefaults = {
    response_type: 'ephemeral',
    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI'),
    token: config('SLACK_TOKEN')
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

            // add error handling for incorrect username format

            let re = new RegExp("<@.+\|.+>")

            if (re.test(p[1])) {
                slack_id = p[1].match(/@.+\|/).toString().replace(/(@|\|)/g,'')
            } else {
                response_text = p[1] + ' is not a valid username. Using current user instead.\n'
            }

        }
        let cars = await query.getAllCarsForUser(slack_id, team_id)
        if (_.isEmpty(cars)) {
            response_text = response_text + 'There are no cars attached to <@' + slack_id + '>'
        } else {
            if (cars.length == 1) {
                response_text = response_text + 'There is 1 car attached to <@' + slack_id + '>:'
            } else {
                response_text = response_text + 'There are ' + cars.length + ' cars attached to <@' + slack_id + '>:'
            }
            for (var i = 0; i < cars.length; i++) {
                response_text = response_text + '\n `' + cars[i].license_plate + '`'
            }
        }
    }

    let msg = _.defaults({
        channel: payload.channel_id,
        text: response_text,
        user: slack_id
    }, msgDefaults)

    // bot.postEphemeral(msg)

    res.set('content-type', 'application/json')
    res.status(201).json(msg)
    return
}

module.exports = { pattern: /^list\b/ig, handler: handler }