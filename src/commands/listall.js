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

    let msg = {
        channel: payload.channel_id,
        text: '',
        user: requester_id
    }

    if (!is_admin) {
        msg.text = 'You do not have permission to list all plates.'
    } else if (p.length != 1) {
        msg.text = 'That\'s not a vaild command. Please use the `/parking listall` format!'
    } else {
        let cars = await query.getAllCars(team_id)
        if (_.isEmpty(cars)) {
            msg.text = msg.text + 'There are no cars assigned to any users in this slack account.'
        } else {
            msg.text = msg.text + 'There are ' + cars.length + ' cars assigned in this slack account:'
            for (var i = 0; i < cars.length; i++) {
                msg.text = msg.text + '\n <@' + cars[i].slack_id + '> - `' + cars[i].license_plate + '`'
            }
        }
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^listall\b/ig, handler: handler }