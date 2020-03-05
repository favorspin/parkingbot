'use strict'

const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let requester_id = payload.user_id
    let slack_id = requester_id
    let team_id = payload.team_id
    let plate = p[1] || ''
    plate = plate.toUpperCase().replace(/[^A-Z0-9]+/ig,'')
    let car_id = await query.getCar(plate, team_id)
    let is_admin = await query.isAdmin(requester_id, team_id)

    let msg = {
        channel: payload.channel_id,
        text: '',
        user: requester_id
    }

    if (car_id) {
        msg.text = '`' + plate + '` already exists!'
    } else if (p.length < 2 || p.length > 3) {
        msg.text = 'That\'s not a vaild command. Please use the `/parking add <PLATE>` format!'
    } else if (p.length == 3 && !is_admin) {
        msg.text = 'You are not allowed to add a plate to another user'
    } else {

        if (p.length == 3) {

            let re = new RegExp("<@.+\|.+>")

            if (re.test(p[2])) {
                slack_id = p[2].match(/@.+\|/).toString().replace(/(@|\|)/g,'')
            } else {
                msg.text = p[2] + ' is not a valid username. Aborting.'
                bot.postEphemeral(msg)
                res.status(200).end()
                return
            }
        }

        let userid = await query.getUser(slack_id, team_id)

        if (!userid) {
            userid = await query.createUser(slack_id, team_id)
        }

        await query.createCar(userid, plate, team_id)

        msg.text = 'OK! I added `' + plate + '` to <@' + slack_id + '>'

    }

    bot.postEphemeral(msg)
    res.status(200).end()
    return
}

module.exports = { pattern: /^add\b/ig, handler: handler }