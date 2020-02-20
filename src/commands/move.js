'use strict'

const config = require('../config')
const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let team_id = payload.team_id
    let requester_id = payload.user_id
    let response_text = ''

    if (p.length != 2) {
        response_text = 'That\'s not a vaild license plate. Please use the `/parking move <licence>` format!'
    } else {
        const plate = p[1].toUpperCase()

        let slack_id = await query.getUsernameByPlate(plate, team_id)

        console.log(slack_id)

        if (slack_id == '') {
            response_text = 'License plate was not found.'
        } else {
            response_text = '<@' + slack_id + '>, move your car!'
        }

    }

    let msg = {
        channel: payload.channel_id,
        text: response_text,
        user: requester_id
    }

    bot.postMessage(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^move\b/ig, handler: handler }