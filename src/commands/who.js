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

    if (p.length != 2) {
        msg.text = 'That\'s not a vaild command. Please use the `/parking who <PLATE>` format!'
    } else {

        if (!is_admin) {
            msg.text = 'You are not allowed to see the owners of cars.'
        } else {
            const plate = p[1].toUpperCase().replace(/[^A-Z0-9]+/ig,'')

            slack_id = await query.getUsernameByPlate(plate, team_id)

            if (slack_id == '') {
                msg.text = 'License plate was not found.'
            } else {
                msg.text = '`' + plate + '` is currently assigned to <@' + slack_id + '>.'
        }
        }
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^who(is)?\b/ig, handler: handler }