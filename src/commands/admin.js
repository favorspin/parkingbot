'use strict'

const _ = require('lodash')
const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {

    let p = payload.text.trim().split(/\s+/)
    let requester_id = payload.user_id
    let slack_id = requester_id
    let team_id = payload.team_id
    let is_admin = await query.isAdmin(requester_id, team_id)
    let re = new RegExp("<@.+\|.+>")
    let skip = false

    let msg = {
        channel: payload.channel_id,
        text: '',
        user: requester_id
    }

    if (p.length < 2 || p.length > 3) {
        msg.text = 'That\'s not a vaild command. Please use the `/parking admin [command] (@user)` format!'
    } else if (!is_admin) {
        msg.text = 'You are not an admin of ParkingBot. This command is not allowed.'
    } else {

        //commands
        switch(true) {
            case /list/.test(p[1]):
                let admins = await query.getAllAdmins()
                msg.text = 'There are ' + admins.length + ' admins assigned to ParkingBot:'
                for (var i = 0; i < admins.length; i++) {
                    msg.text = msg.text + '\n <@' + admins[i].slack_id + '>'
                }
                break

            case /add/.test(p[1]):
                if (p.length != 3) {
                    msg.text = 'That\'s not a valid command. Please use the `/parking admin add @user` format!'
                } else if (re.test(p[2])) {
                    slack_id = p[2].match(/@.+\|/).toString().replace(/(@|\|)/g,'')

                    let user_id = await query.getUser(slack_id, team_id)

                    if (!user_id) {
                        user_id = await query.createUser(slack_id, team_id)
                    }

                    await query.createAdmin(user_id)

                    msg.text = 'OK! I added <@' + slack_id + '> as an admin for ParkingBot.'
                } else {
                    msg.text = p[2] + ' is not a valid username. Aborting.'
                }
                break

            case /(rm|remove|del(ete)?)/.test(p[1]):
                if (p.length != 3) {
                    msg.text = 'That\'s not a valid command. Please use the `/parking admin remove @user` format!'
                } else if (re.test(p[2])) {
                    slack_id = p[2].match(/@.+\|/).toString().replace(/(@|\|)/g,'')

                    if (slack_id == requester_id) {
                        msg.text = 'You may not remove yourself as an admin.'
                    } else {
                        let user_id = await query.getUser(slack_id, team_id)

                        if (!user_id) {
                            msg.text = '<@' + slack_id + '> is not a user of ParkingBot.'
                        } else {
                            await query.removeAdmin(user_id)

                            msg.text = 'OK! I have removed <@' + slack_id + '> as an admin for ParkingBot.'
                        }
                    }

                } else {
                    msg.text = p[2] + ' is not a valid username. Aborting.'
                }
                break

            default:
                msg.text = 'That\'s not a vaild command. Please use the `/parking admin [command] (@user)` format!'
        }
    }

    bot.postEphemeral(msg)

    res.status(200).end()
    return
}

module.exports = { pattern: /^admin\b/ig, handler: handler }