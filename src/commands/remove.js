'use strict'

const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let requester_id = payload.user_id
    let response_text = ''
    let plate = p[1] || ''
    let team_id = payload.team_id
    plate = plate.toUpperCase().replace(/[^A-Z0-9]+/ig,'')
    let result = ''

    if (p.length != 2) {
        response_text = 'That\'s not a vaild command. Please use the `/parking remove <license plate>` format!'
    } else {
        let removed = await query.removeCar(plate, team_id)
        if (removed) {
            result = ' has been removed!'
        } else {
            result = ' could not be found!'
        }
        response_text = plate + result
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

module.exports = { pattern: /^(remove|delete)\b/ig, handler: handler }