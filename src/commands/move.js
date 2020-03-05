'use strict'

const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let team_id = payload.team_id
    let requester_id = payload.user_id
    let slack_id = requester_id

    let msg = {
        channel: payload.channel_id,
        text: '',
        user: requester_id
    }

    if (p.length != 2) {
        msg.text = 'That\'s not a vaild license plate. Please use the `/parking move <PLATE>` format!'
    } else {
        const plate = p[1].toUpperCase().replace(/[^A-Z0-9]+/ig,'')

        slack_id = await query.getUsernameByPlate(plate, team_id)

        if (slack_id == '') {
            msg.text = 'License plate was not found.'
        } else {
            let pm_text = ':wave: Hey <@' + slack_id + '>! <@' + requester_id + '> is trying to leave! Please move your car so they can get out! :car::dash:'
            let pm = {
               text: pm_text
            }
            bot.postPrivateMessage(slack_id, pm)
            msg.text = 'Ok! I\'ve sent a message to the owner of `' + plate + '`!'
        }

    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^move\b/ig, handler: handler }