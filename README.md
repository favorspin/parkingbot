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

`/parking` -> /commands/parkingbot</br>
`/move` -> /commands/parkingbot

Finally the following permissions will need to be assigned to the app under OAuth & Permissions in the Slack App dashboard:

    channels:read
    chat:write
    commands
    im:write

**Run:**

    $ npm install
    $ npm start

## API / Testing
Note: local dev will require you to create a webserver and point Slack slash commands to that URL.

**Commands**</br>
Slash Commands from Slack send a `POST` message to their assigned route with a payload containing some information regarding the user, workpace, channel and command message sent. An example is provided below. The following routes define 

##### Payload
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

##### Routes
###### Upcheck
`[GET] ` -> `/`: You should recieve status 200 and a 👋🌎 message.
###### Parking Commands
`[POST]` -> `/commands/parkingbot`: Must include a message payload. The following is a sample of what Slack will send when a slash command is initiated.

## Commands
Currently, ParkingBot Supports seven commands. Some (or some variations) are only accessible by defined admins, are are not displayed in help on in-Slack instructions.

### help or `/parking help`
Lits available commands for users. It does not list all commands or all command variations on purpose.

### admin
The admin command has several sub-commands. All sub commands are only available to admins.

##### admin list or `/parking admin list`
Lists all current current ParkingBot Admins in the workspace

##### admin add or `/parking admin add <USER>`
Adds the specifiied user to the list of admins and grants them permission on all admin-only commands. Returns an error if the user can not be found.

##### admin remove or `/parking admin remove <USER>`
Removes the specified user from the list of admins and revokes their permissions on all admin-only commands. Returns an error if the user can not be found.

### add or `/parking add <PLATE> (<USER>)`
Adds a plate to the current user, or the user supplied if that user exists. Only admins can add to other users. It will return an error if the plate already exists on another user or if the supplied user does not exist.

### list or `/parking list (<USER>)`
Lists all license plates assigned to the current user, or the user supplied if that user exists. If the supplied user does not exist or the user is not an admin, it will return an invalid username error and instead list all plates assigned to the current user.

### listall or `/parking listall`
Lists all license plates and assigned users in the Slack workspace. This command is only available to admins.

### move or `/parking move <PLATE>` or `/move <PLATE>`
Sends a DM to the plate owner requesting them to move their car. Also returns a confirmation message to the initiator. It will return an error if the plate can not be found amongst the workspace's assigned plates

### remove or `/parking remove <PLATE>`
Removes a plate from any user it is assigned to. It will return an error if the plate can not be found. Only admins can remove plates that are not assigned to their own account.

### who or `/parking who <PLATE>`
Returns the user who is assigned to the supplied plate. It will return an error if the plate can not be found. Only admins can use this command.