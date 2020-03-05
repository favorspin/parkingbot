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
    let is_admin = await query.isAdmin(requester_id, team_id)

    if (p.length < 1 || p.length > 2) {
        response_text = 'That\'s not a vaild command. Please use the `/parking list` format!'
    } else {
        if (p.length == 2) {

            let re = new RegExp("<@.+\|.+>")

            if (re.test(p[1]) && is_admin) {
                slack_id = p[1].match(/@.+\|/).toString().replace(/(@|\|)/g,'')
            } else {
                response_text = p[1] + ' is not a valid username. Using current user instead.\n'
            }

            if (!is_admin) {
                'You do not have permission to view plates attached to someone else\'s account. Using current user instaed.'
                slack_id = requester_id
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

    let msg = {
        channel: payload.channel_id,
        text: response_text,
        user: requester_id
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^list\b/ig, handler: handler }