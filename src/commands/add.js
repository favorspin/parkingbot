'use strict'

const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let requester_id = payload.user_id
    let slack_id = requester_id
    let team_id = payload.team_id
    let channel_id = payload.channel_id
    let response_text = ''
    let plate = p[1] || ''
    let skipadd = false
    plate = plate.toUpperCase().replace(/[^A-Z0-9]+/ig,'')
    let car_id = await query.getCar(plate, team_id)
    let is_admin = await query.isAdmin(requester_id, team_id)

    if (car_id) {
        response_text = plate + ' already exists!'
    } else if (p.length < 2 || p.length > 3) {
        response_text = 'That\'s not a vaild command. Please use the `/parking add <PLATE>` format!'
    } else {
        if (p.length == 3) {

            let re = new RegExp("<@.+\|.+>")

            if (re.test(p[2])) {
                slack_id = p[2].match(/@.+\|/).toString().replace(/(@|\|)/g,'')
            } else {
                response_text = p[2] + ' is not a valid username. Aborting.'
                skipadd = true
            }

            if (!is_admin) {
                response_text = 'You are not allowed to add a plate to another user.'
                skipadd = true
            }
        }

        if(!skipadd) {
            let userid = await query.getUser(slack_id, team_id)

            if (!userid) {
                userid = await query.createUser(slack_id, team_id)
            }

            await query.createCar(userid, plate, team_id)

            response_text = 'OK! I added `' + plate + '` to <@' + slack_id + '>'
        }

    }

    let msg = {
        channel: channel_id,
        text: response_text,
        user: requester_id
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^add\b/ig, handler: handler }