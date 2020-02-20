const config = require('../config')
const query = require('../db/query')
const bot = require('../bot')

const handler = async (payload, res) => {
    let channel_id = payload.channel_id

    bot.checkChannel({channel: channel_id})

    res.status(200).end()
    return
}

module.exports = { pattern: /^channel\b/ig, handler: handler }