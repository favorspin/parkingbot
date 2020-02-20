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

    let msg = _.defaults(payload, msgDefaults)

    bot.chat.postEphemeral(msg)
}

const postMessage = async (payload) => {
    let msg = _.defaults(payload, msgDefaults)

    bot.chat.postMessage(msg)
}

const postPrivateMessage async (user, payload) => {

    let pm = await bot.conversations.open({token: token, users: user})

    let msg = _.defaults(payload, msgDefaults, { channel: pm.channel.id })
}

// module.exports = bot;
module.exports = {
    postEphemeral: postEphemeral,
    postMessage: postMessage,
    postPrivateMessage: postPrivateMessage
}