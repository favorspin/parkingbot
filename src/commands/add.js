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
    let slack_id = payload.user_id
    let team_id = payload.team_id
    let response_text = ''
    let plate = p[1] || ''
    let skipadd = false
    plate = plate.toUpperCase()
    let carid = await query.getCar(plate, team_id)

    if (carid) {
        response_text = plate + ' already exists!'
    } else if (p.length < 2 || p.length > 3) {
        response_text = 'That\'s not a vaild command. Please use the `/parking add <license plate>` format!'
    } else {
        if (p.length == 3) {

            let re = new RegExp("<@.+\|.+>")

            if (re.test(p[2])) {
                slack_id = p[2].match(/@.+\|/).toString().replace(/(@|\|)/g,'')
            } else {
                response_text = p[2] + ' is not a valid username. Aborting.'
                skipadd = true
            }
        }

        if(!skipadd) {
            let userid = await query.getUser(slack_id, team_id)

            if (!userid) {
                userid = await query.createUser(slack_id, team_id)
            }

            await query.createCar(userid, plate, team_id)

            response_text = plate + ' added!'
        }

    }

    let msg = _.defaults({
        channel: payload.channel_name,
        text: response_text
    }, msgDefaults);

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /^add\b/ig, handler: handler }