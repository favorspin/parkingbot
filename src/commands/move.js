'use strict'

const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let team_id = payload.team_id
    let requester_id = payload.user_id
    let slack_id = requester_id
    let response_text = ''

    if (p.length != 2) {
        response_text = 'That\'s not a vaild license plate. Please use the `/parking move <PLATE>` format!'
    } else {
        const plate = p[1].toUpperCase().replace(/[^A-Z0-9]+/ig,'')

        slack_id = await query.getUsernameByPlate(plate, team_id)

        if (slack_id == '') {
            response_text = 'License plate was not found.'
        } else {
            response_text = ':wave: Hey <@' + slack_id + '>! <@' + requester_id + '> is trying to leave! \
                            Please move your car so they can get out! :car::dash:'
        }

    }

    let msg = {
        channel: payload.channel_id,
        text: 'Ok! I\'ve sent a message to <@' + slack_id + '>!',
        user: requester_id
    }

    let pm = {
        text: response_text
    }

    bot.postEphemeral(msg)
    bot.postPrivateMessage(slack_id, pm)

    res.status(200).end()
    return
}

module.exports = { pattern: /^move\b/ig, handler: handler }