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
const prettyMs = require("pretty-ms");

module.exports.command = "followage <user> <channel>";
module.exports.describe = "Returns follow duration of the user on the target channel";
module.exports.builder = {
  user: {
    type: "string",
    coerce: arg => arg.toLowerCase(),
  },
  channel: {
    type: "string",
    coerce: arg => arg.toLowerCase(),
  },
};
module.exports.handler = async function followageHandler (argv) {
  const users = await argv.twitchApi.fetchUsers([argv.user, argv.channel]);

  if (users.length < 2) {
    argv.reply("Couldn't find the specified user and/or channel");
    return;
  }

  const user = users.find(u => u.name === argv.user);
  const channel = users.find(u => u.name === argv.channel);

  try {
    const follow = await argv.twitchApi.fetchUserFollowByChannel(user._id, channel._id);

    const duration = prettyMs(new Date() - new Date(follow.created_at), { verbose: true });

    argv.reply(`User ${user.name} has been following ${channel.name} for ${duration} and has notifications turned ${follow.notifications ? "on" : "off"}`);
  } catch (err) {
    if (err.statusCode === 404) {
      argv.reply(`User ${user.name} is not following ${channel.name}`);
      return;
    }

    logger.error("Error on command followage", argv.user, argv.channel, err);
  }
};
