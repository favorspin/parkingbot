'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./config')
const commands = require('./commands')
const helpCommand = require('./commands/help')
const db = require('./db')

const app = express()

db.connect()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).send("👋🌎")
})

app.post('/commands/parkingbot', (req, res) => {
    let payload = req.body

    if (!payload || Object.keys(payload).length == 0 || payload.token !== config('PARKINGBOT_COMMAND_TOKEN')) {
        let err = '✋ Huh? An invalid slash token was provided.\n' +
                  'Is your Slack slash token correctly configured?'
        console.log(err)
        res.status(401).end(err)
        return
    }

    let cmd = _.reduce(commands, (a, cmd) => {

        return payload.text.trim().match(cmd.pattern) ? cmd : a
    }, helpCommand)

    cmd.handler(payload, res)
})

app.post('/commands/parkingbot/move', (req, res) => {
    let payload = req.body

    if (!payload || Object.keys(payload).length == 0 || payload.token !== config('PARKINGBOT_COMMAND_TOKEN')) {
        let err = '✋ Huh? An invalid slash token was provided.\n' +
                  'Is your Slack slash token correctly configured?'
        console.log(err)
        res.status(401).end(err)
        return
    }

    payload.text = 'move ' + payload.text

    let cmd = _.reduce(commands, (a, cmd) => {

        return payload.text.trim().match(cmd.pattern) ? cmd : a
    }, helpCommand)

    cmd.handler(payload, res)
})

app.listen(config('PORT'), (err) => {
    if (err) throw err

    console.log(`\n🚀  ParkingBot LIVES on PORT ${config('PORT')} 🚀`)

    if (config('SLACK_TOKEN')) {
        console.log(`🤖 beep boop: @ParkingBot is live\n`)
   }
})