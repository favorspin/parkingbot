'use strict'

const _ = require('lodash')
const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let requester_id = payload.user_id
    let slack_id = requester_id
    let team_id = payload.team_id
    let response_text = ''
    let is_admin = await query.isAdmin(rquester_id)

    if (p.length < 2 || p.length > 3) {
        response_text = 'That\'s not a vaild command. Please use the `/parking admin [command] (@user)` format!'
    } else if (!is_admin) {
        response_text = 'You are not an admin of ParkingBot. This command is not allowed.'
    } else {

        //commands
        switch(p[1]) {
            case 'list':
                let admins = await query.getAllAdmins()
                response_text = 'There are ' + admins.length + ' admins assigned to ParkingBot:'
                for (var i = 0; i < admins.length; i++) {
                    response_text = response_text + '\n <@' + admins[i].slack_id + '>'
                }
                break
            case 'add':
                console.log('add')
                break
            case 'remove':
                console.log('remove')
                break
            default:
                console.log('default')

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

module.exports = { pattern: /^admin\b/ig, handler: handler }