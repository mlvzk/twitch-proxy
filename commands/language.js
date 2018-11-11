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
const _ = require("lodash");
const { getName: getNameByCode } = require("iso-639-1");

module.exports.command = "language <user>";
module.exports.describe = "Sorts and returns broadcast languages of streamers the user follows";
module.exports.builder = {
  user: {
    type: "string",
    coerce: arg => arg.toLowerCase(),
  },
};
module.exports.handler = async function languageHandler (argv) {
  const [user] = await argv.twitchApi.fetchUsers([argv.user]);

  if (!user) {
    argv.reply(`User not found`);
    return;
  }

  const follows = await argv.twitchApi.fetchAllUserFollows(user._id);

  const languages = follows.map(follow => follow.channel.broadcaster_language).map(code => getNameByCode(code) || "Other");
  const occurrs = _.fromPairs(_.sortBy(_.toPairs(_.countBy(languages)), 1).reverse());

  argv.reply(`Languages of streamers followed by ${argv.user} are ${Object.entries(occurrs).map(([language, times]) => language + ": " + times).join(", ")}`);
};
