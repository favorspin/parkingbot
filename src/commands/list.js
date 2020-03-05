'use strict'

const _ = require('lodash')
const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let requester_id = payload.user_id
    let slack_id = requester_id
    let team_id = payload.team_id
    let is_admin = await query.isAdmin(requester_id, team_id)
    let re = new RegExp("<@.+\|.+>")

    let msg = {
        channel: payload.channel_id,
        text: '',
        user: requester_id
    }

    if (p.length < 1 || p.length > 2) {
        msg.text = 'That\'s not a vaild command. Please use the `/parking list` format!'
    } else if (p.length == 2 and !is_admin) {
        msg.text = 'You do not have permission to view plates attached to someone else\'s account. Using current user instead.\n'
    } else {
        if (p.length == 2) {
            if (re.test(p[2])) {
                slack_id = p[2].match(/@.+\|/).toString().replace(/(@|\|)/g,'')
            } else {
                msg.text = p[2] + ' is not a valid username. Using current user instead.\n'
            }
        }

        let cars = await query.getAllCarsForUser(slack_id, team_id)
        if (_.isEmpty(cars)) {
            msg.text = msg.text + 'There are no cars attached to <@' + slack_id + '>'
        } else {
            if (cars.length == 1) {
                msg.text = msg.text + 'There is 1 car attached to <@' + slack_id + '>:'
            } else {
                msg.text = msg.text + 'There are ' + cars.length + ' cars attached to <@' + slack_id + '>:'
            }

            for (var i = 0; i < cars.length; i++) {
                msg.text = msg.text + '\n `' + cars[i].license_plate + '`'
            }
        }

    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^list\b/ig, handler: handler }