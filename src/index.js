// index.js

/**
 * Required External Modules
 */

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('./config');
const commands = require('./commands');
const helpCommand = require('./commands/help');
// const path = require('path');

/**
 * App Variables
 */

const app = express();

/**
 *  App Configuration
 */

/**
 * Routes Definitions
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send("👋🌎");
});

app.post('/', (req, res) => {
    console.log(`POST incoming.`);
    res.status(200).send(req.body);
});

app.post('/commands/parkingbot', (req, res) => {
    let payload = req.body;

    if (!payload || Object.keys(payload).length == 0 || payload.token !== config('PARKINGBOT_COMMAND_TOKEN')) {
        let err = '✋ Huh? An invalid slash token was provided.\n' +
                  'Is your Slack slash token correctly configured?';
        console.log(err);
        res.status(401).end(err);
        return
    }

    let cmd = _.reduce(commands, (a, cmd) => {

        return payload.text.match(cmd.pattern) ? cmd : a;
    }, helpCommand);

    console.log(cmd)

    cmd.handler(payload, res);
});

/**
 * Server Activation
 */

app.listen(config('PORT'), (err) => {
    if (err) throw err;

    console.log(`\n🚀  ParkingBot LIVES on PORT ${config('PORT')} 🚀`);

    if (config('SLACK_TOKEN')) {
        console.log(`🤖 beep boop: @parkingbot is real-time\n`);
        bot.listen({ token: config('SLACK_TOKEN') });
   }
});