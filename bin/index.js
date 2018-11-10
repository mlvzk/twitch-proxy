// Copyright (C) 2018 mlvzk
// 
// This file is part of twitch-proxy.
// 
// twitch-proxy is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// twitch-proxy is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with twitch-proxy.  If not, see <http://www.gnu.org/licenses/>.

require("dotenv").config();
const logger = require("../utils/logger");
const parseMessage = require("../utils/parseMessage");
const sendMessage = require("../utils/sendMessage");
const TwitchApi = require("../api/");
const WS = require("ws");
const yargs = require("yargs/yargs");

const config = {
  allowedUsers: process.env.ALLOWED_USERS.split(","),
  username: process.env.USERNAME,
  channel: process.env.CHANNEL,
  token: process.env.TOKEN,
  clientID: process.env.CLIENT_ID,
};

(async () => {
  const twitchApi = new TwitchApi(config.clientID, config.token);
  await twitchApi.prepareUserInfo();

  const webSocket = new WS("wss://irc-ws.chat.twitch.tv:443/", "irc");

  const parser = yargs().scriptName("").usage(`/w ${config.username} [command]`).commandDir("../commands");
  const context = {
    sendMessage: (channel, message) => sendMessage(webSocket, channel, message),
    twitchApi,
  };

  webSocket.on("open", () => {
    webSocket.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
    webSocket.send(`PASS oauth:${config.token}`);
    webSocket.send(`NICK ${config.username}`);
    webSocket.send(`JOIN ${config.channel}`);
  });

  webSocket.on("message", (data) => {
    logger.log("data", data);
    const msg = parseMessage(data.replace(/\r\n$/, ""));

    if (msg.command === "PING") {
      webSocket.send(`PONG :${msg.params[0]}`);
      return;
    }

    if (msg.command === "WHISPER" && config.allowedUsers.includes(msg.username)) {
      const msgArgs = msg.message;
      parser.parse(msgArgs, {
        ...context,
        reply: text => sendMessage(webSocket, config.channel, `/w ${msg.username} ${text}`),
      }, (err, argv, output) => {
        if (err) {
          logger.error("error on message", msg, err);
          sendMessage(webSocket, config.channel, `/w ${msg.username} ${err.message}`);
          return;
        }

        if (!output) {
          return;
        }

        sendMessage(webSocket, config.channel, `/w ${msg.username} ${output}`);
      });
    }
  });
})();
