'use strict'

const _ = require('lodash');
const config = require('../config');
const query = require('../db/query');

const msgDefaults = {
    response_type: 'in_channel',
    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI')
}

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let username = payload.user_name
    let slack_id = payload.user_id
    let attachments = []
    let plate = p[1] || ''
    plate = plate.toUpperCase()
    let carid = await query.getCar(plate)

    if (carid) {
        attachments = [{
            text: plate + ' already exists!'
        }]
    } else if (p.length < 2 || p.length > 3) {
        attachments = [{
            text: 'That\'s not a vaild command. Please use the `/parkingbot move <license plate>` format!'
        }]
    } else {
        if (p.length == 3) {
            username = p[2].replace(/@/,'')
        }
        let userid = await query.getUser(slack_id)

        if (!userid) {
            userid = await query.createUser(slack_id)
        }

        await query.createCar(userid,plate)

        attachments = [{
            text: plate + ' added!'
        }]

    }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults);

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /^add/ig, handler: handler }