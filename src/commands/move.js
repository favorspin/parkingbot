'use strict'

const _ = require('lodash')
const config = require('../config')
const query = require('../db/query')
const bot = require('../bot')

// const msgDefaults = {
//     response_type: 'in_channel',
//     username: 'ParkingBot',
//     icon_emoji: config('ICON_EMOJI')
// }

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let team_id = payload.team_id
    let response_text = ''

    if (p.length != 2) {
        response_text = 'That\'s not a vaild license plate. Please use the `/parking move <licence>` format!'
    } else {
        const plate = p[1].toUpperCase()

        let slack_id = await query.getUsernameByPlate(plate, team_id)

        if (slack_id == '') {
            response_text = 'License plate was not found.'
        } else {
            response_text = '<@' + slack_id + '>, move your car!'
        }

    }

    // let msg = _.defaults({
    //     channel: slack_id,
    //     text: response_text
    // }, msgDefaults)

    let msg = {
        channel: slack_id,
        text: response_text
    }

    bot.postMessage(msg)

    res.status(200).end()

    // res.set('content-type', 'application/json')
    // res.status(200).json(msg)
    return
}

module.exports = { pattern: /^move\b/ig, handler: handler }