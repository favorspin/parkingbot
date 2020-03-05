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
    let is_admin = await query.isAdmin(requester_id, team_id)

    if (p.length != 2) {
        response_text = 'That\'s not a vaild command. Please use the `/parking remove <PLATE>` format!'
    } else {
        my_car = await getUsernameByPlate(plate)

        if (my_car != requester_id && !is_admin) {
            response_text = 'You are not allowed to remove cars that aren\'t yours.'
        } else {
            let removed = await query.removeCar(plate, team_id)
            if (removed) {
                result = '` has been removed!'
            } else {
                result = '` could not be found!'
            }
            response_text = '`' + plate + result
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

module.exports = { pattern: /^(rm|remove|del(ete)?)\b/ig, handler: handler }