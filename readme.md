# twitch-proxy
Control your secondary Twitch accounts through Twitch's whispers

## ENV
Required envs:
```
ALLOWED_USERS=admin,someoneelse # usernames of accounts the bot should listen to
USERNAME=botusername
CHANNEL=#botusername # default channel name, can be your bot's channel
TOKEN=token
CLIENT_ID=client-id
```

TOKEN should be without the "oauth:" prefix

To get the TOKEN and CLIENT_ID you can visit https://twitchapps.com/tmi/ (website not related to this project). The CLIENT_ID is in the URL after you click "Connect with Twitch"

You can put them in your .env file in the root directory of the project

## Install
Make sure you have Nodejs v8
```bash
npm install
```

## Run
```bash
npm start
```

## Test
```bash
npm test
```

## Commands

### `help`
Show help

### `message <channel> <text>`
Usage: `/w botusername message b0aty Hi!`
Aliases: m, msg

### `follow <usernames...>`
Usage: `/w botusername follow b0aty forsen`

### `unfollow <usernames...>`
Usage: `/w botusername unfollow b0aty forsen`

### `followage <user> <channel>`
Usage: `/w botusername followage forsen b0aty`
