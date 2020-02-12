'use strict'

const _ = require('lodash')
const config = require('../config')
const query = require('../db/query')

const msgDefaults = {
    response_type: 'in_channel',
    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI')
}

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let username = payload.username
    let attachments = []
    let text = ''

    if (p.length < 1 || p.length > 2) {
        text = 'That\'s not a vaild command. Please use the `/parkingbot list` format!'
    } else {
        if (p.length == 2) {
            username = p[1].replace(/@/,'')
        }
        let cars = await query.getAllCarsForUser(username)
        console.log(cars)
        if (_.isEmpty(cars)) {
            text = 'There are no cars attached to ' + username
        } else {
            text = 'There\'s at least one car here.'
        }
    }

    attachments = [{
        text: text
    }]

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /^list/ig, handler: handler }