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

const logger = require("../utils/logger");

module.exports.command = ["message <channel> <message...>", "msg", "m"];
module.exports.describe = "send a message to the target channel";
module.exports.builder = {
  channel: {
    type: "string",
    coerce: arg => (arg.startsWith("#") ? arg : `#${arg}`).toLowerCase(),
  },
  message: {
    coerce: arg => arg.join(" "),
  },
};
module.exports.handler = function messageHandler (argv) {
  argv.sendMessage(argv.channel, argv.message);

  argv.reply(`Sent ${argv.message} to ${argv.channel}`);
  logger.log("sent the message", argv.channel, argv.message);
};
