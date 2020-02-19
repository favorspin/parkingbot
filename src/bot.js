'use strict'

const Slack = require('slack');
const _ = require('lodash');
const config = require('./config');

const token = config('SLACK_TOKEN')
const bot = new Slack({token: token})

const msgDefaults = {

    username: 'ParkingBot',
    icon_emoji: config('ICON_EMOJI'),
    token: token
}

const postEphemeral = async (payload) => {
    console.log(payload)

    let msg = _.defaults(payload, msgDefaults)

    console.log(msg)

    bot.chat.postEphemeral(msg)
}

// module.exports = bot;
module.exports = {
    postEphemeral: postEphemeral
}