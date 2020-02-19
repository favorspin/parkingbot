'use strict'

const Slack = require('slack');
const _ = require('lodash');
const config = require('./config');

const bot = new Slack({token: config('SLACK_TOKEN')})

// bot.started((payload) => {
//     this.self = payload.self;
// });

// bot.message((msg) => {
//     if (!msg.user) return;
//     if(!_.includes(msg.teext.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) return;

//     slack.chat.postMessage({
//         token: config('SLACK_TOKEN'),
//         icon_emoji: config('ICON_EMOJI'),
//         channel: msg.channel,
//         username: 'ParkingBot',
//         text: `🤖 beep boop: I read you loud and clear!`
//     }, (err, data) => {
//         if (err) throw err;

//         let txt = _.truncate(data.message.text);

//         console.log(`🤖  beep boop: I responded with "${txt}"`);
//     });
// });

const postEphemeral = async (msg) => {
    bot.chat.postEphemeral(msg)
}

// module.exports = bot;
module.exports = {
    postEphemeral: postEphemeral
}