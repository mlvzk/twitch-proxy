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

module.exports.command = "unfollow <channels...>";
module.exports.describe = "Unfollow the target channels";
module.exports.builder = {
  channels: {
    coerce: arg => arg.map(a => a.toString().toLowerCase()),
  },
};
module.exports.handler = async function unfollowHandler (argv) {
  const users = await argv.twitchApi.fetchUsers(argv.channels);

  for (const user of users) {
    await argv.twitchApi.unfollow(user._id);
  }

  argv.reply(`Unfollowed ${argv.channels.join(", ")}`);
  logger.log("unfollowed", argv.channels);
};
