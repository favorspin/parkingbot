'use strict'

const Slack = require('slack');
const _ = require('lodash');
const config = require('./config');

const bot = new Slack({token: config('SLACK_TOKEN')})

const postEphemeral = async (msg) => {
    console.log(msg)

    bot.chat.postEphemeral(msg)
}

// module.exports = bot;
module.exports = {
    postEphemeral: postEphemeral
}