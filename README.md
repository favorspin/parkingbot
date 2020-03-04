# ParkingBot

ParkingBot is a Slack application that allows you to notify the owner of a car that you are blocked in and need them to move.

## Dependencies
- Node 12.14.1
- PostgreSQL

## Install
For local testing, set up a `.env` file in the root directory, containing your required environment variables. The following are required for local development:

- PORT
- DATABASE_URL
- PARKINGBOT_COMMAND\_TOKEN
- SLACK_TOKEN

For produciton, create your environment variables on the server. The following are required in production:

- DATABASE_URL
- NODE_ENV
- PARKINGBOT_COMMAND\_TOKEN
- SLACK_TOKEN

Tokens are provided by Slack when you install an app in your workspace. When installing an app on Slack the following slash commands will need to be set:

`/parking` -> \<app_url\>/commands/parkingbot</br>
`/move` -> \<app_url\>/commands/parkingbot/move

Finally the following permissions will need to be assigned to the app under OAuth & Permissions in the Slack App dashboard:

    channels:read
    chat:write
    commands
    im:write

**Run:**

    $ npm install
    $ npm start

## Testing
Note: local dev will require you to create a webserver and point Slack slash commands to that URL.

**Upcheck**

`[GET] ` -> `/`: You should recieve status 200 and a 👋🌎 message.

**Commands**

`[POST]` -> `/commands/parkingbot`</br>
`[POST]` -> `/commands/parkingbot/move`: Must include a message payload. The following is a sample of what Slack will send when a slash command is initiated. Note that the "move" route is intended to be a different slash command.

    {
        "token": "78XpJSHMTtLTepVnytIqPZpU",
        "team_id": "T4UG8C282",
        "team_domain": "ratturddonut",
        "channel_id": "D4UJWLGRK",
        "channel_name": "directmessage",
        "user_id": "U4TQWE9A4",
        "user_name": "spin",
        "command": "/parking",
        "text": "listall",
        "response_url": "https://hooks.slack.com/commands/T4UG8C282/951614091927/yvxCzs8WeNa6RuivP34MJZi5",
        "trigger_id": "949752351376.164552410274.bc24f3313985c9181cd8f3b03244d032"
    }

## Commands
Currently, ParkingBot Supports seven commands. While all commands can be accessed by all users, some (or some variations) are not useful for most users and are hidden from the in-Slack instructions as well as the help command. Optional user arguments are left out of all in-Slack instructions.

### help or `/parking help`
Lits available commands for users. It does not list all commands or all command variations on purpose.

### add or `/parking add <PLATE> (<USER>)`
Adds a plate to the current user, or the user supplied if that user exists. It will return an error if the plate already exists on another user or if the supplied user does not exist.

### list or `/parking list (<USER>)`
Lists all license plates assigned to the current user, or the user supplied if that user exists. If the supplied user does not exist, it will return an invalid username error and instead list all plates assigned to the current user.

### listall or `/parking listall` (unlisted)
Lists all license plates and assigned users in the Slack workspace.

### move or `/parking move <PLATE>` or `/move <PLATE>`
Sends a DM to the plate owner requesting them to move their car. Also returns a confirmation message to the initiator. It will return an error if the plate can not be found amongst the workspace's assigned plates

### remove or `/parking remove <PLATE>` (unlisted)
Removes a plate from any user it is assigned to. It will return an error if the plate can not be found.

### who or `/parking who <PLATE>` or `/parking whois <PLATE>`
Returns the user who is assigned to the supplied plate. It will return an error if the plate can not be found.